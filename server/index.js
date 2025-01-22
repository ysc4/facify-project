import cors from 'cors';
import express from 'express';
import mysql from 'mysql';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'facify',
    port: '3306'
    });

app.use(express.static(path.join(__dirname, '../dist')));
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001; // Change the port number here

app.listen(PORT, () => {
    console.log('Server is running on port 3001');
    });

app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});
    

app.post('/facify/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ success: false, message: 'Email and password are required' });
    }
    const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ success: false, message: 'Database error' });
        }
        if (result.length > 0) {
            res.send({ success: true });
        } else {
            res.send({ success: false, message: 'Invalid credentials' });
        }
    });
});