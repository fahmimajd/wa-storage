# WhatsApp Storage App

Aplikasi untuk menyimpan gambar dari WhatsApp ke server dan mengelolanya via web interface.

## Fitur
- Simpan gambar dari WhatsApp dengan nama kustom.
- Interface web untuk login, lihat file, kontak, dan kelola user.
- Role-based access: User (Files, Contacts), Admin (semua menu).
- Password di-hash dengan bcrypt.
- Sesi WhatsApp persistent dengan LocalAuth.
- Backend dan frontend dijalankan dengan PM2.

## Prasyarat
- Node.js v18 atau lebih baru (disarankan v18 untuk stabilitas).
- MySQL server.
- Git.
- PM2 (global).

## Langkah Instalasi

### 1. Clone Repositori
```
git clone https://github.com/username/whatsapp-storage-app.git
cd whatsapp-storage-app

###2. Setup Backend
Masuk ke direktori backend:

cd backend
Install dependensi:

npm install
Buat database MySQL:
sql

CREATE DATABASE wa_storage_db;
USE wa_storage_db;
CREATE TABLE uploads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_number VARCHAR(20),
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'user') DEFAULT 'user'
);
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_number VARCHAR(20) UNIQUE,
    name VARCHAR(50)
);
Edit kredensial database di index.js:
javascript

const db = mysql.createPool({
    host: 'localhost',
    user: 'youruser',
    password: 'yourpassword',
    database: 'wa_storage_db'
});
Tambahkan user awal (opsional):
sql

INSERT INTO users (username, password, role) VALUES ('admin', '$2b$10$[hash]', 'admin');
Generate hash dengan bcrypt:

node -e "require('bcrypt').hash('admin123', 10).then(hash => console.log(hash))"
### 3. Setup Frontend
Masuk ke direktori frontend:

cd ../frontend
Install dependensi:

npm install
Build aplikasi:

npm run build
4. Jalankan dengan PM2
Install PM2 secara global:

npm install -g pm2
npm install -g http-server  # Untuk frontend
Jalankan backend:

cd ../backend
pm2 start index.js --name "wa-backend"
Jalankan frontend:

cd ../frontend
pm2 start http-server --name "wa-frontend" -- build -p 3000
Simpan dan atur startup:

pm2 save
pm2 startup
# Ikuti perintah yang diberikan, lalu pm2 save lagi
5. Konfigurasi Server
Pastikan port terbuka:

sudo ufw allow 5000
sudo ufw allow 3000
Akses:
Backend: http://<server-ip>:5000
Frontend: http://<server-ip>:3000
Penggunaan
Buka <server-ip>:3000/login.
Login dengan kredensial (misalnya: admin/admin123).
Scan QR di halaman Connection untuk hubungkan WhatsApp.
Kirim gambar ke nomor server via WhatsApp.
Kelola file, kontak, dan user via web.