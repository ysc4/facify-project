import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mysql from 'mysql';
import multer from 'multer';
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
app.use(bodyParser.json());

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
            const user = result[0];
            res.send({ success: true, org_id: user.org_id });
        } else {
            res.send({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.post('/facify/bookings/:orgID', (req, res) => {
    const { orgID } = req.params;
    if (!orgID) {
        return res.status(400).send({ success: false, message: 'No bookings submitted' });
    }
    const query = 'SELECT event_information.booking_id, event_information.event_date, event_information.event_start, event_information.event_end, event_information.activity_title, facilities.facility_name, status.status_name, user.org_name FROM event_information JOIN facilities ON event_information.facility_id = facilities.facility_id JOIN booking_status ON event_information.booking_id = booking_status.booking_id JOIN status ON booking_status.status_id = status.status_id JOIN user ON event_information.org_id = user.org_id WHERE event_information.org_id = ?';
    db.query(query, [orgID], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ success: false, message: 'Database error' });
        }
        res.send({ success: true, bookings: result });
    });
});

app.get('/facify/booking-info/:bookingID', (req, res) => {
    const { bookingID } = req.params;
    if (!bookingID) {
        return res.status(400).send({ success: false, message: 'No bookingID provided' });
    }
    const query = `
        SELECT 
            event_information.*, 
            facilities.facility_name, 
            status.status_name, 
            user.org_name,
            event_equipment.*,
            requirement.*
        FROM event_information 
        JOIN facilities ON event_information.facility_id = facilities.facility_id 
        JOIN booking_status ON event_information.booking_id = booking_status.booking_id 
        JOIN status ON booking_status.status_id = status.status_id 
        JOIN user ON event_information.org_id = user.org_id
        JOIN event_equipment ON event_information.booking_id = event_equipment.booking_id
        LEFT JOIN requirement ON event_information.booking_id = requirement.booking_id
        WHERE event_information.booking_id = ?`;
    db.query(query, [bookingID], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ success: false, message: 'Database error' });
        }
        res.send({ success: true, bookingInfo: result });
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

app.post('/facify/booking-info/upload', upload.single('file'), (req, res) => {
    const { filename, file, date_time } = req.file;
    const { requirementName, bookingID } = req.body;

    // Save file information to the database
    const query = 'INSERT INTO requirement (booking_id, requirement_name, file_name, file, date_time_submitted) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [bookingID, requirementName, filename, file, date_time], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }
        res.status(200).json({ success: true, message: 'File uploaded successfully' });
    });
});


