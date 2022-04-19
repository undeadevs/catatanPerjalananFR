if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const app = express();

const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const tripsRoutes = require('./routes/tripsRoutes');

app.listen(2110, () => console.log('Listening to requests on port 2110'));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next)=>{
    res.locals.html = (strings, ...expressions)=>{
        const sanitized = expressions.map(expression=>{
            if(typeof expression==='string') return expression.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/;/g,'');
            else return expression.toString().replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/;/g,'');
        });
        return sanitized.reduce((a,b,i)=>a+b+strings[i+1],strings[0]);
    }
    next();
});

app.use((req, res, next)=>{
    if((req.path.includes('auth') || req.path.includes('login') || req.path.includes('register')) && req.session.user) return res.redirect('/dashboard');
    if((!req.path.includes('auth') && !req.path.includes('login') && !req.path.includes('register')) && !req.session.user) return res.redirect('/auth');
    if(req.session.user) res.locals.user = req.session.user;
    next();
});

app.get('/', (req, res) => res.redirect('/auth'));
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/trips', tripsRoutes);