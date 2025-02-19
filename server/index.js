import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
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
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000; // Change the port number here

app.listen(PORT, () => {
    console.log('Server is running on port 3000');
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

app.get('/facify/bookings/:orgID', (req, res) => {
    const { orgID } = req.params;
    if (!orgID) {
        return res.status(400).send({ success: false, message: 'No bookings submitted' });
    }
    const query = `SELECT 
            ei.booking_id, 
            ei.event_date, 
            ei.event_start, 
            ei.event_end, 
            ei.activity_title, 
            f.facility_name, 
            s.status_name, 
            u.org_name 
        FROM event_information ei
        JOIN facilities f ON ei.facility_id = f.facility_id
        JOIN (
            SELECT bs.booking_id, bs.status_id, bs.date_time
            FROM booking_status bs
            JOIN (
                SELECT booking_id, MAX(date_time) AS max_date_time
                FROM booking_status
                GROUP BY booking_id
            ) latest_status ON bs.booking_id = latest_status.booking_id AND bs.date_time = latest_status.max_date_time
        ) latest_bs ON ei.booking_id = latest_bs.booking_id
        JOIN status s ON latest_bs.status_id = s.status_id
        JOIN user u ON ei.org_id = u.org_id
        WHERE ei.org_id = ?`;
    db.query(query, [orgID], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ success: false, message: 'Database error' });
        }
        res.send({ success: true, bookings: result });
    });
});

app.get('/facify/booking-info/:orgID/:bookingID', (req, res) => {
    const { orgID, bookingID } = req.params;
    if (!bookingID || !orgID) {
        return res.status(400).send({ success: false, message: 'No bookingID or orgID provided' });
    }
    
    const query = `
        SELECT 
            event_information.*, 
            facilities.facility_name, 
            status.status_name, 
            user.org_name,
            event_equipment.*
        FROM event_information 
        JOIN facilities ON event_information.facility_id = facilities.facility_id 
        JOIN (
            SELECT bs.booking_id, bs.status_id, bs.date_time
            FROM booking_status bs
            JOIN (
                SELECT booking_id, MAX(date_time) AS max_date_time
                FROM booking_status
                GROUP BY booking_id
            ) latest_status ON bs.booking_id = latest_status.booking_id AND bs.date_time = latest_status.max_date_time
        ) latest_bs ON event_information.booking_id = latest_bs.booking_id
        JOIN status ON latest_bs.status_id = status.status_id 
        JOIN user ON event_information.org_id = user.org_id
        JOIN event_equipment ON event_information.booking_id = event_equipment.booking_id
        WHERE event_information.booking_id = ? AND event_information.org_id = ?`;
    
    db.query(query, [bookingID, orgID], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ success: false, message: 'Database error' });
        }
        res.send({ success: true, bookingInfo: result });
    });
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/files');
    },
    filename: function (req, file, cb) {
        const { requirementName } = req.body;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFilename = `${requirementName}-${uniqueSuffix}-${file.originalname}`;
        return cb(null, newFilename);
    }
});

const upload = multer({storage: storage })

app.post('/facify/booking-info/upload', upload.single('file'), (req, res) => {
    const filename = req.file.filename;
    const { bookingID, requirementName } = req.body;
    const date_time = new Date().toISOString();

    const filePath = path.join(__dirname, 'public', 'files', filename);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'File read error', error: err });
        }

        const query = 'INSERT INTO requirement (booking_id, file_name, file, date_time_submitted) VALUES (?, ?, ?, ?)';
        db.query(query, [bookingID, filename, data, date_time], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error', error: err });
            }
            res.status(200).json({ success: true, message: 'File uploaded successfully' });

            const checkReqQuery = 'SELECT COUNT(*) AS count FROM requirement WHERE booking_id = ?';
            db.query(checkReqQuery, [bookingID], (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Database error', error: err });
                }

                const count = result[0].count;
                const totalReqs = 3;

                if (count === totalReqs) {
                    const updateStatusQuery = 'INSERT INTO booking_status (booking_id, status_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE status_id = VALUES(status_id)';
                    db.query(updateStatusQuery, [bookingID, 2], (err, result) => {
                        if (err) {
                            return res.status(500).json({ success: false, message: 'Database error', error: err });
                        }
                        res.status(200).json({ success: true, message: 'File uploaded and status updated to all requirements uploaded' });
                    });
                } else {
                    res.status(200).json({ success: true, message: 'File uploaded successfully' });
                }
            });
        });
    });
});

app.get('/facify/booking-info/:orgID/:bookingID/requirements', (req, res) => {
    const { orgID, bookingID } = req.params;
    if (!bookingID || !orgID) {
        return res.status(400).send({ success: false, message: 'No bookingID or orgID provided' });
    }
    
    const query = 'SELECT * FROM requirement WHERE booking_id = ? AND EXISTS (SELECT 1 FROM event_information WHERE booking_id = ? AND org_id = ?)';
    db.query(query, [bookingID, bookingID, orgID], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ success: false, message: 'Database error' });
        }
        res.send({ success: true, requirements: result });
    });
});

app.get('/facify/booking-info/:orgID/:bookingID/logs', (req, res) => {
    const { orgID, bookingID } = req.params;
    if (!bookingID || !orgID) {
        return res.status(400).send({ success: false, message: 'No bookingID or orgID provided' });
    }

    const query = `
        SELECT booking_status.*, status.remarks
        FROM booking_status 
        JOIN status ON booking_status.status_id = status.status_id 
        WHERE booking_status.booking_id = ? 
        AND EXISTS (SELECT 1 FROM event_information WHERE booking_id = ? AND org_id = ?)
        ORDER BY booking_status.date_time DESC`;

    db.query(query, [bookingID, bookingID, orgID], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'No logs found' });
        }
        res.status(200).json({ success: true, logs: result });
    });
});

app.get('/facify/booking-info/:bookingID/:requirementName', (req, res) => {
    const { bookingID, requirementName } = req.params;

    const query = 'SELECT file_name, OCTET_LENGTH(file) AS file_size, date_time_submitted FROM requirement WHERE booking_id = ? AND file_name LIKE ?';
    db.query(query, [bookingID, `%${requirementName}%`], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }
        res.status(200).json({ success: true, file: result[0] });
    });
});

app.post('/facify/venue-booking/:orgID/:facilityID/create', (req, res) => {
    const { orgID, facilityID } = req.params;
    const { eventDate, eventStart, eventEnd, activityTitle, attendance, speakerName, equipment, status, bookingDate, bookingTime } = req.body;
    console.log(bookingDate, bookingTime);

    const query = 'INSERT INTO event_information (event_date, event_start, event_end, activity_title, org_id, facility_id, booking_date, booking_time, expected_attendance, speaker_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [eventDate, eventStart, eventEnd, activityTitle, orgID, facilityID, bookingDate, bookingTime, attendance, speakerName], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }

        const bookingID = result.insertId;

        const equipmentQuery = 'INSERT INTO event_equipment (booking_id, tables, chairs, bulletin_boards, speaker, microphone, flagpole, podium, platform, electrician, janitor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(equipmentQuery, [bookingID, ...equipment], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error', error: err });
            }

            const date_time = new Date(`${bookingDate}T${bookingTime}`).toISOString().slice(0, 19).replace('T', ' ');
            const statusID = status === 'pencil' ? 1 : 2;
            console.log('statusID:', statusID);
            console.log('date_time:', date_time);

            const statusQuery = 'INSERT INTO booking_status (booking_id, status_id, date_time, admin_id) VALUES (?, ?, ?, ?)';
            db.query(statusQuery, [bookingID, statusID, date_time, 1], (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Database error', error: err });
                }
                res.status(200).json({ success: true, message: 'Booking created successfully' });
            });
        });
    });
});

app.get('/facify/venue-availability/:facilityID', (req, res) => {
    const { facilityID } = req.params;
    const { month, year } = req.query;

    const query = `
        SELECT ei.*, s.status_name
        FROM event_information ei
        JOIN (
            SELECT bs.booking_id, bs.status_id, bs.date_time
            FROM booking_status bs
            JOIN (
                SELECT booking_id, MAX(date_time) AS max_date_time
                FROM booking_status
                GROUP BY booking_id
            ) latest_status ON bs.booking_id = latest_status.booking_id AND bs.date_time = latest_status.max_date_time
        ) latest_bs ON ei.booking_id = latest_bs.booking_id
        JOIN status s ON latest_bs.status_id = s.status_id
        WHERE ei.facility_id = ? AND MONTH(ei.event_date) = ? AND YEAR(ei.event_date) = ?`;

    db.query(query, [facilityID, month, year], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, events: result });
    });
});


