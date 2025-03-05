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
```bash
git clone https://github.com/username/whatsapp-storage-app.git
cd whatsapp-storage-app
