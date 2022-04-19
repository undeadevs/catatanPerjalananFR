const csv = require('csv');
const fs = require('fs');
const path = require('path');

module.exports = class User {
    /**
     * 
     * @param {string} nik 
     * @param {string} nama 
     */
    constructor(nik, nama) {
        this.nik = nik;
        this.nama = nama;
    }

    /**
     * 
     * @returns {Promise<User>}
     */
    async save(){
        return await User.create(this.nik, this.nama);
    }

    /**
     * 
     * @param {string} nik 
     * @param {string} nama 
     * @returns {Promise<User>}
     */
    static async create(nik, nama) {
        const users = await User.all();
        if (users.find(user => user.nik === nik)) throw new Error('User dengan NIK tersebut sudah ada');
        const user = new User(nik, nama);
        users.push(user);
        const filePath = path.join(__dirname, '..', 'db');
        const fileName = 'users.csv';
        const writeStream = fs.createWriteStream(path.join(filePath, fileName));
        const csvStringify = csv.stringify(users, { quoted: false, header: true, columns: ['nik', 'nama'] });
        csvStringify.pipe(writeStream);
        return new Promise((resolve, reject) => {
            csvStringify.on('error', (err) => reject(err));
            csvStringify.on('end', () => resolve(user));
        })
    }

    /**
     * 
     * @returns {Promise<User[]>}
     */
    static async all() {
        const results = [];
        const filePath = path.join(__dirname, '..', 'db');
        const fileName = 'users.csv';
        if (!fs.existsSync(path.join(filePath, fileName))) {
            fs.mkdirSync(filePath, { recursive: true });
            fs.writeFileSync(path.join(filePath, fileName), 'nik,nama');
        }
        const readStream = fs.createReadStream(path.join(filePath, fileName)).pipe(csv.parse({ columns: true }));
        readStream.on('data', (data) => results.push(new User(data.nik, data.nama)));
        return new Promise((resolve, reject) => {
            readStream.on('error', (err) => reject(err));
            readStream.on('end', () => resolve(results));
        })
    }
}