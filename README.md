# **Soal UKK Paket 1: Catatan Perjalanan**

**Nama: Ilham Al Basith**

**Kelas: XII RPL 1**

**Tanggal Pengerjaan: 18 - 19 April 2022**

<br>

Project ini dibuat untuk keperluan Uji Kompetensi Keahlian jurusan *Rekayasa Perangkat Lunak*. Dengan waktu pengerjaan maksimal 16 jam yang dibagi menjadi 2 hari.

Masing-masing siswa dapat memilih antara 3 paket soal yaitu:
- Paket 1: Catatan Perjalanan
- Paket 2: Reservasi Hotel
- Paket 3: Restoran/Cafe

Dengan itu, saya memilih paket 1 yang berjudul "Catatan Perjalanan" berbasis web.

Project yang harus dibuat ini sangatlah simple: membuat sebuah aplikasi untuk mencatat kunjungan masyarakat beserta suhu tubuh di masa pandemi COVID-19 ini. Yang membuat project ini berbeda adalah cara penyimpanan datanya yang tidak menggunakan basis data konvensional seperti: MySQL, SQLServer, MongoDB, dan sebagainya. Dalam project ini, kita diperintahkan untuk menyimpan data pada sebuah file `.txt` atau `.csv`.

## **Dokumentasi Pengembangan**

Backend yang saya gunakan adalah **Node.js**.

Untuk menginstall semua package yang diperlukan ketik `npm install` pada console.

Untuk menjalankan aplikasi ketik `npm run dev` pada console.

**NPM Package yang saya gunakan:**
- `csv` 

    Library untuk parsing dan writing file `.csv`

- `dotenv`

    Library untuk menginitialisasikan environment variables yang ada dalam file `.env`

- `ejs`

    Library untuk templating engine **EJS (Embedded JavaScript)**

- `express`

    Salah satu framework aplikasi web untuk Node.js

- `express-session`

    Session library khusus untuk `express`

- `express-validator`

    Validation library khusus untuk `express`

- `uuid`

    Universally Unique ID (UUID) generator

**Library frontend yang saya gunakan:**
- `cleave.js`

    Library untuk formatting input

### **Model, View, Controller (MVC)**

Saya menggunakan konsep MVC untuk kemudahan pengembangan lanjutan yang akan dilakukan jika aplikasi ini akan dikembangkan lebih jauh lagi.

**1. Models**

  - `User`

    Model untuk menambahkah data "User" yang disimpan dalam file `db/users.csv`

  - `Trip`
    
    Model untuk memanipulasi dan mendapatkan data "Catatan Perjalanan" yang ada pada direktori `db/trips` dengan setiap file terkait dengan setiap "User"

**2. Controllers**

  - `authController` 
    
    Controller untuk segala route yang berkaitan dengan Autentikasi dan Registrasi

  - `dashboardController`

    Controller untuk segala route yang berkaitan dengan dashboard

  - `tripsController`

    Controller untuk segala route yang berkaitan dengan CRUD data "Catatan Perjalanan"

**3. Views**

  - `partials`
  
    Direktori untuk segala bagian-bagian views yang dapat digunakan ulang

  - `trips`

    Direktori untuk semua yang berkaitan dengan CRUD data "Catatan Perjalanan"

  - `auth.ejs`

    View untuk Login dan Registrasi

  - `dashboard.ejs`

    View untuk dashboard

### **Lainnya**

- Direktori `public`
  
  Berisi semua file statis yang akan di-serve seperti `.css` dan frontend `.js` kepada client

- Direktori `routes`
  
  Yang menyatukan antara route dan controller

- File `.gitignore`
  
  Jika nantinya di-upload sebagai git repository, semua yang ada file dan direktori yang dituliskan dalam file ini akan diabaikan.