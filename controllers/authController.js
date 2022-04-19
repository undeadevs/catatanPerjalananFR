const express = require('express');
const validator = require('express-validator');

const User = require('../models/User');

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const auth = (req, res) => {
    res.render('auth.ejs');
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const login = async (req, res) => {
    await validator.body('nik').notEmpty().withMessage('NIK tidak boleh kosong').isNumeric().withMessage('NIK harus berupa angka').isLength({ min: 16, max: 16 }).withMessage('NIK harus 16 karakter').run(req);
    await validator.body('nama').notEmpty().withMessage('Nama Lengkap tidak boleh kosong').isString().withMessage('Nama Lengkap harus berupa string').run(req);
    const valResult = validator.validationResult(req);
    if (!valResult.isEmpty()) return res.json({ error: valResult.array()[0].msg });
    try {
        const { nik, nama } = req.body;
        const users = await User.all();
        const authUser = users.find((user) => user.nik === nik && user.nama === nama);
        if (!authUser) return res.json({ error: 'NIK dan/atau Nama Lengkap salah' });
        req.session.user = authUser;
        return res.json({ success: 'Login berhasil!', redirect: '/dashboard' });
    } catch (err) {
        console.error(err);
        return res.json({ error: 'Terjadi kesalahan server' });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const register = async (req, res) => {
    await validator.body('nik').notEmpty().withMessage('NIK tidak boleh kosong').isNumeric().withMessage('NIK harus berupa angka').isLength({ min: 16, max: 16 }).withMessage('NIK harus 16 karakter').run(req);
    await validator.body('nama').notEmpty().withMessage('Nama Lengkap tidak boleh kosong').isString().withMessage('Nama Lengkap harus berupa string').run(req);
    const valResult = validator.validationResult(req);
    if (!valResult.isEmpty()) return res.json({ error: valResult.array()[0].msg });
    try {
        const { nik, nama } = req.body;
        const authUser = await User.create(nik, nama);
        req.session.user = authUser;
        return res.json({ success: 'Register berhasil! Mohon tunggu...', redirect: '/dashboard' });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const logout = (req, res) => {
    delete req.session.user;
    return res.json({ success: 'Logout berhasil!', redirect: '/auth' });
}

module.exports = {
    auth,
    login,
    register,
    logout
}