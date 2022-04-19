const csv = require('csv');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v4;

const User = require('./User');

module.exports = class Trip {
    /**
     * 
     * @param {string|null|undefined} id 
     * @param {string} nik 
     * @param {Date} tanggalWaktu 
     * @param {string} lokasi 
     * @param {number} suhu 
     */
    constructor(id, nik, tanggalWaktu, lokasi, suhu) {
        this.id = id ?? uuid();
        this.nik = nik;
        this.tanggalWaktu = tanggalWaktu;
        this.lokasi = lokasi;
        this.suhu = suhu;
    }

    /**
     * 
     * @param {string|null|undefined} id 
     * @param {string} nik 
     * @param {Date} tanggalWaktu 
     * @param {string} lokasi 
     * @param {number} suhu 
     * @returns {Promise<Trip>}
     */
    static async create(id, nik, tanggalWaktu, lokasi, suhu) {
        const trips = await Trip.findByNIK(nik);
        const trip = new Trip(id, nik, tanggalWaktu, lokasi, suhu);
        trips.push(trip);
        trips.forEach(trip => {
            trip.tanggalWaktu = trip.tanggalWaktu.toISOString();
        });
        const filePath = path.join(__dirname, '..', 'db/trips');
        const fileName = `${nik}.csv`;
        const writeStream = fs.createWriteStream(path.join(filePath, fileName));
        const csvStringify = csv.stringify(trips, { quoted: false, header: true, columns: ['id', 'tanggalWaktu', 'lokasi', 'suhu'] });
        csvStringify.pipe(writeStream);
        return new Promise((resolve, reject) => {
            csvStringify.on('error', (err) => reject(err));
            csvStringify.on('end', () => resolve(trip));
        })
    }

    /**
     * 
     * @param {*} id 
     * @param {*} nik 
     * @param {{tanggalWaktu: Date, lokasi: string, suhu: number}} updateFields 
     * @returns {Promise<Trip>}
     */
    static async update(id, nik, { tanggalWaktu, lokasi, suhu }) {
        const trips = await Trip.findByNIK(nik);
        const trip = trips.find(trip => trip.id === id);
        if (!trip) throw new Error('Catatan Perjalanan tidak ditemukan');
        if (tanggalWaktu) trip.tanggalWaktu = tanggalWaktu;
        if (lokasi) trip.lokasi = lokasi;
        if (suhu) trip.suhu = suhu;
        const updatedTrips = trips.map(_trip => {
            if (_trip.id === id) return trip;
            return _trip;
        });
        updatedTrips.forEach(trip => {
            trip.tanggalWaktu = trip.tanggalWaktu.toISOString();
        });
        const filePath = path.join(__dirname, '..', 'db/trips');
        const fileName = `${nik}.csv`;
        const writeStream = fs.createWriteStream(path.join(filePath, fileName));
        const csvStringify = csv.stringify(updatedTrips, { quoted: false, header: true, columns: ['id', 'tanggalWaktu', 'lokasi', 'suhu'] });
        csvStringify.pipe(writeStream);
        return new Promise((resolve, reject) => {
            csvStringify.on('error', (err) => reject(err));
            csvStringify.on('end', () => resolve(trip));
        })
    }

    /**
     * 
     * @param {string|null|undefined} id 
     * @param {string} nik 
     * @returns {Promise<Trip>}
     */
     static async delete(id, nik) {
        const trips = await Trip.findByNIK(nik);
        const trip = trips.find(trip => trip.id === id);
        if (!trip) throw new Error('Catatan Perjalanan tidak ditemukan');
        trips.forEach(trip => {
            trip.tanggalWaktu = trip.tanggalWaktu.toISOString();
        });
        const filePath = path.join(__dirname, '..', 'db/trips');
        const fileName = `${nik}.csv`;
        const writeStream = fs.createWriteStream(path.join(filePath, fileName));
        const csvStringify = csv.stringify(trips.filter(_trip=>_trip.id!==id), { quoted: false, header: true, columns: ['id', 'tanggalWaktu', 'lokasi', 'suhu'] });
        csvStringify.pipe(writeStream);
        return new Promise((resolve, reject) => {
            csvStringify.on('error', (err) => reject(err));
            csvStringify.on('end', () => resolve(trip));
        })
    }

    /**
     * 
     * @param {string} nik
     * @returns {Promise<Trip[]>}
     */
    static async findByNIK(nik) {
        const users = await User.all();
        if (!users.find(user => user.nik === nik)) throw new Error('User dengan NIK tersebut tidak ditemukan');
        const results = [];
        const filePath = path.join(__dirname, '..', 'db/trips');
        const fileName = `${nik}.csv`;
        if (!fs.existsSync(path.join(filePath, fileName))) {
            fs.mkdirSync(filePath, { recursive: true });
            fs.writeFileSync(path.join(filePath, fileName), 'tanggalWaktu,lokasi,suhu');
        }
        const readStream = fs.createReadStream(path.join(filePath, fileName)).pipe(csv.parse({ columns: true, cast: true, castDate: true }));
        readStream.on('data', (data) => results.push(new Trip(data.id, nik, data.tanggalWaktu, data.lokasi, data.suhu)));
        return new Promise((resolve, reject) => {
            readStream.on('error', (err) => reject(err));
            readStream.on('end', () => resolve(results));
        })
    }
}