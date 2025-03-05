const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Tambahkan bcrypt

const app = express();
app.use(cors());
app.use(express.json());
app.use('/storage', express.static(path.join(__dirname, '..', 'storage')));

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'wa_storage_db'
});

let qrCodeData = '';
let isReady = false;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'] }
});

client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        if (err) console.log('QR Error:', err);
        qrCodeData = url;
        console.log('QR Generated');
    });
});

client.on('ready', () => {
    console.log('WhatsApp Client Ready');
    isReady = true;
});

client.on('authenticated', () => {
    console.log('Authenticated successfully');
});

client.on('auth_failure', (msg) => {
    console.log('Authentication failed:', msg);
    qrCodeData = '';
    isReady = false;
    client.initialize();
});

client.on('disconnected', (reason) => {
    console.log('WhatsApp disconnected:', reason);
    isReady = false;
    client.initialize();
});

client.on('message', async (msg) => {
    console.log('Message received:', msg);
    if (msg.hasMedia && msg.type === 'image') {
        console.log('Image detected from:', msg.from);
        console.log('Body:', msg.body);
        try {
            const attachment = await msg.downloadMedia();
            console.log('Attachment downloaded:', attachment);
            const senderNumber = msg.from.replace('@c.us', '');
            const mimeType = attachment.mimetype;
            const extension = mimeType.split('/')[1];
            const filenameRaw = msg.body || msg.caption || `image_${Date.now()}`;
            const filename = filenameRaw.includes('.') ? filenameRaw : `${filenameRaw}.${extension}`;
            console.log('Generated filename:', filename);
            const dirPath = path.join(__dirname, '..', 'storage', senderNumber);
            const filePath = path.join(dirPath, filename);

            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log('Directory created:', dirPath);
            }

            fs.writeFile(filePath, attachment.data, 'base64', async (err) => {
                if (err) {
                    console.log('File write error:', err);
                    return;
                }
                console.log('File saved:', filePath);
                try {
                    await db.query(
                        'INSERT INTO uploads (sender_number, file_name, file_path) VALUES (?, ?, ?)',
                        [senderNumber, filename, filePath]
                    );
                    console.log('Database entry created for:', filename);
                } catch (dbErr) {
                    console.log('Database error:', dbErr);
                }
            });
        } catch (err) {
            console.log('Download media error:', err);
        }
    } else {
        console.log('Message ignored: Not an image or no media');
    }
});

client.initialize();

app.get('/api/qr', (req, res) => res.json({ qr: qrCodeData }));
app.get('/api/status', (req, res) => res.json({ ready: isReady }));
app.post('/api/files', async (req, res) => {
    const { senderNumber } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM uploads WHERE sender_number = ?', [senderNumber]);
        res.json(rows);
    } catch (err) {
        console.log('Files endpoint error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});
app.get('/download', (req, res) => {
    const filePath = decodeURI(req.query.file_path);
    console.log('Download requested for:', filePath);
    if (fs.existsSync(filePath)) {
        res.download(filePath, path.basename(filePath), (err) => {
            if (err) {
                console.log('Download error:', err);
                res.status(500).send('Failed to download file');
            }
        });
    } else {
        console.log('File not found:', filePath);
        res.status(404).send('File not found');
    }
});
app.delete('/api/delete', async (req, res) => {
    const { file_path } = req.body;
    try {
        await db.query('DELETE FROM uploads WHERE file_path = ?', [file_path]);
        if (fs.existsSync(file_path)) {
            fs.unlinkSync(file_path);
            console.log('File deleted:', file_path);
        } else {
            console.log('File not found on disk:', file_path);
        }
        res.json({ success: true });
    } catch (err) {
        console.log('Delete error:', err);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

// Endpoint untuk menambah user dengan hash password
app.post('/api/users', async (req, res) => {
    const { username, password, role } = req.body;
    console.log('Received user data:', { username, role });
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role || 'user']
        );
        console.log('User saved:', username);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Failed to save user:', err);
        res.status(500).json({ error: 'Failed to save user', details: err.message });
    }
});

app.get('/api/users', async (req, res) => {
    console.log('Fetching users');
    try {
        const [rows] = await db.query('SELECT id, username, role FROM users');
        console.log('Users fetched:', rows);
        res.json(rows);
    } catch (err) {
        console.error('Failed to fetch users:', err);
        res.status(500).json({ error: 'Failed to fetch users', details: err.message });
    }
});

// Endpoint untuk login dengan hash password
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        console.log('Query result:', rows);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password); // Bandingkan password
            if (match) {
                console.log('Login successful:', user.username);
                res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
            } else {
                console.log('Login failed: Invalid password');
                res.status(401).json({ success: false, error: 'Invalid username or password' });
            }
        } else {
            console.log('Login failed: User not found');
            res.status(401).json({ success: false, error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.listen(5000, () => console.log('Backend running on port 5000'));