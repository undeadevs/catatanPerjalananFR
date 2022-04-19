const express = require('express');
const validator = require('express-validator');

const Trip = require('../models/Trip');

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const index = (req, res) => {
    res.render('trips/index');
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const get = async (req, res) => {
    try {
        const { search, sortBy, sortType, page } = req.query;
        const sortBys = ['tanggalWaktu', 'suhu'];
        const sortTypes = ['asc', 'desc'];
        let trips = await Trip.findByNIK(req.session.user.nik);
        trips.forEach((trip) => {
            trip.status = trip.suhu > 37 ? 'Demam' : 'Normal';
        })

        if (search) {
            const searchWords = search.toLowerCase().split(' ');
            trips = trips.filter((trip) => {
                return searchWords.every((sword) => {
                    return trip.tanggalWaktu.toLocaleDateString('id', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }).toLowerCase().includes(sword) ||
                        trip.lokasi.toLowerCase().includes(sword) ||
                        trip.suhu.toString().toLowerCase().includes(sword) ||
                        trip.status.toLowerCase().includes(sword);
                })
            })
        }

        if (sortBys.includes(sortBy) && sortTypes.includes(sortType)) {
            const st = sortTypes.findIndex((sType) => sType === sortType) || -1;
            switch (sortBy) {
                case 'tanggalWaktu':
                    trips = trips.sort((a, b) => (b.tanggalWaktu.getTime() - a.tanggalWaktu.getTime()) * st);
                    break;

                case 'suhu':
                    trips = trips.sort((a, b) => (b.suhu - a.suhu) * st);
                    break;

                default:
                    return res.json({ error: 'Unreachable' });
            }
        }

        let currentPage = page || 1;
        if (trips.length === 0) currentPage = 0;
        const limit = 10;
        const offset = (currentPage - 1) * limit;
        const pageTotal = Math.ceil(trips.length / limit);
        const hasPrev = currentPage > 1;
        const hasNext = currentPage < pageTotal;

        return res.json({ data: (currentPage<0?[]:trips.slice(offset, offset + limit)), currentPage, pageTotal, hasPrev, hasNext });
    } catch (err) {
        console.error(err);
        return res.json({ error: err.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const create = async (req, res) => {
    res.render('trips/add');
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const store = async (req, res) => {
    await validator.body('tanggalWaktu').notEmpty().withMessage('Tanggal & Waktu tidak boleh kosong').isISO8601().withMessage('Format Tanggal & Waktu salah').toDate().run(req);
    await validator.body('lokasi').notEmpty().withMessage('Lokasi tidak boleh kosong').isString('Lokasi harus berupa string').run(req);
    await validator.body('suhu').notEmpty().withMessage('Suhu tidak boleh kosong').isFloat().withMessage('Suhu harus berupa angka').isFloat({ min: 35, max: 40 }).withMessage('Suhu harus berada pada range 35-40').toFloat().run(req);
    const valResult = validator.validationResult(req);
    if (!valResult.isEmpty()) return res.json({ error: valResult.array()[0].msg });
    try {
        const { tanggalWaktu, lokasi, suhu } = req.body;
        const newTrip = await Trip.create(null, req.session.user.nik, tanggalWaktu, lokasi, suhu);
        return res.json({ success: 'Berhasil tambah Catatan Perjalanan', redirect: '/trips' });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const show = async (req, res) => {
    const trips = await Trip.findByNIK(req.session.user.nik);
    const trip = trips.find(_trip=>_trip.id===req.params.id);
    if(!trip) return res.render('trips/edit');
    res.render('trips/edit', {data: trip});
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const update = async (req, res) => {
    await validator.body('tanggalWaktu').notEmpty().withMessage('Tanggal & Waktu tidak boleh kosong').isISO8601().withMessage('Format Tanggal & Waktu salah').toDate().run(req);
    await validator.body('lokasi').notEmpty().withMessage('Lokasi tidak boleh kosong').isString('Lokasi harus berupa string').run(req);
    await validator.body('suhu').notEmpty().withMessage('Suhu tidak boleh kosong').isFloat().withMessage('Suhu harus berupa angka').isFloat({ min: 35, max: 40 }).withMessage('Suhu harus berada pada range 35-40').toFloat().run(req);
    const valResult = validator.validationResult(req);
    if (!valResult.isEmpty()) return res.json({ error: valResult.array()[0].msg });
    try {
        const { tanggalWaktu, lokasi, suhu } = req.body;
        const updatedTrip = await Trip.update(req.params.id, req.session.user.nik, { tanggalWaktu, lokasi, suhu });
        return res.json({ success: 'Berhasil ubah Catatan Perjalanan', redirect: '/trips' });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const remove = async (req, res) => {
    try {
        const updatedTrip = await Trip.delete(req.params.id, req.session.user.nik);
        return res.json({ success: 'Berhasil hapus Catatan Perjalanan', redirect: '/trips' });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

module.exports = {
    index,
    get,
    create,
    store,
    show,
    update,
    remove
}