const express = require('express');

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const dashboard = (req, res)=>{
    res.render('dashboard');
}

module.exports = {
    dashboard
}