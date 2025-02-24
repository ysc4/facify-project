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
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000; // Change the port number here

app.listen(PORT, () => {
    console.log('Server is running on port 3000');
    });

app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});


// Login endpoint
app.post('/facify/login/:type', (req, res) => {
    const { email, password } = req.body;
    const { type } = req.params;

    if (!email || !password) {
        return res.status(400).send({ success: false, message: 'Email and password are required' });
    }

    let query;
    if (type === 'Admin') {
        query = 'SELECT * FROM facility WHERE email = ? AND password = ?';
    } else if (type === 'Organization') {
        query = 'SELECT * FROM user WHERE email = ? AND password = ?';
    } else {
        return res.status(400).send({ success: false, message: 'Invalid login type' });
    }

    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ success: false, message: 'Database error' });
        }

        if (result.length > 0) {
            const user = result[0];

            let imageBase64 = null;
            if (user.org_image || user.admin_image) {
                const imageBuffer = user.org_image || user.admin_image;
                imageBase64 = Buffer.from(imageBuffer).toString('base64'); 
            }

            return res.send({
                success: true,
                org_id: user.org_id || null,
                org_name: user.org_name || null,
                admin_id: user.admin_id,
                admin_name: user.first_name + ' ' + user.last_name || null,
                image: imageBase64 ? `data:image/png;base64,${imageBase64}` : null, // Set Base64 format
                role: type  
            });
        } else {
            return res.status(401).send({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Get bookings endpoint
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

// Get booking info endpoint
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
        const filename = `${file.originalname}`;
        return cb(null, filename);
    }
});

const upload = multer({storage: storage })

// Upload requirements endpoint
app.post('/facify/booking-info/:bookingID/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    console.log("Received request:", req.body);
    console.log("File uploaded:", req.file);

    const { bookingID } = req.params;
    const filePath = req.file.path; // Get the uploaded file path
    const filename = req.file.filename; // Get the stored file name
    const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'File read error', error: err });
        }

        const query = 'INSERT INTO requirement (booking_id, file_name, file, date_time_submitted) VALUES (?, ?, ?, ?)';
        
        db.query(query, [bookingID, filename, fileData, date_time], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error', error: err });
            }

            // Check if all required files are uploaded
            const checkReqQuery = 'SELECT COUNT(*) AS count FROM requirement WHERE booking_id = ?';
            
            db.query(checkReqQuery, [bookingID], (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Database error', error: err });
                }

                const count = result[0].count;
                const totalReqs = 4;

                if (count === totalReqs) {
                    const updateStatusQuery = 'INSERT INTO booking_status (booking_id, status_id, date_time, admin_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE status_id = VALUES(status_id)';
                    
                    db.query(updateStatusQuery, [bookingID, 2, date_time, 1], (err, result) => { //Update admin_id depending on the logged in admin
                        if (err) {
                            return res.status(500).json({ success: false, message: 'Database error', error: err });
                        }
                        return res.status(200).json({ success: true, message: 'File uploaded and status updated' });
                    });
                } else {
                    return res.status(200).json({ success: true, message: 'File uploaded successfully' });
                }
            });
        });
    });
});

// Get requirements endpoint
app.get('/facify/booking-info/:orgID/:bookingID/requirements', (req, res) => {
    const { orgID, bookingID } = req.params;
    if (!orgID || !bookingID) {
        return res.status(400).send({ success: false, message: 'Missing orgID or bookingID' });
    }
    const query = `
        SELECT r.*, OCTET_LENGTH(r.file) AS file_size 
        FROM requirement r
        JOIN event_information e ON r.booking_id = e.booking_id
        WHERE r.booking_id = ? AND e.org_id = ?`;
    db.query(query, [bookingID, orgID], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ success: false, message: 'Database error' });
        }
        if (result.length === 0) {
            return res.status(404).send({ success: false, message: 'No requirements found or unauthorized access' });
        }
        res.send({ success: true, requirements: result });
    });
});

// Get update logs endpoint
app.get('/facify/booking-info/:orgID/:bookingID/logs', (req, res) => {
    const { orgID, bookingID } = req.params;
    if (!bookingID || !orgID) {
        return res.status(400).send({ success: false, message: 'No bookingID or orgID provided' });
    }

    const query = `
        SELECT bs.*, s.*
        FROM booking_status bs
        JOIN status s ON bs.status_id = s.status_id
        JOIN (
            SELECT status_id, MAX(date_time) AS latest_date
            FROM booking_status
            WHERE booking_id = ?
            GROUP BY status_id
        ) latest_logs 
        ON bs.status_id = latest_logs.status_id 
        AND bs.date_time = latest_logs.latest_date
        WHERE bs.booking_id = ? 
        AND EXISTS (SELECT 1 FROM event_information WHERE booking_id = ? AND org_id = ?)
        ORDER BY bs.date_time DESC`;

    db.query(query, [bookingID, bookingID, bookingID, orgID], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'No logs found' });
        }
        res.status(200).json({ success: true, logs: result });
    });
});


// Create booking endpoint
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
                res.status(200).json({ success: true, message: 'Booking created successfully', bookingID: bookingID });
            });
        });
    });
});

// Update booking endpoint
app.put('/facify/booking-info/:bookingID/update', (req, res) => {
    const { bookingID } = req.params;
    const { eventDate, eventStart, eventEnd, activityTitle, attendance, speakerName, equipment } = req.body;

    const query = 'UPDATE event_information SET event_date = ?, event_start = ?, event_end = ?, activity_title = ?, expected_attendance = ?, speaker_name = ? WHERE booking_id = ?';
    db.query(query, [eventDate, eventStart, eventEnd, activityTitle, attendance, speakerName, bookingID], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }

        const equipmentQuery = 'UPDATE event_equipment SET tables = ?, chairs = ?, bulletin_boards = ?, speaker = ?, microphone = ?, flagpole = ?, podium = ?, platform = ?, electrician = ?, janitor = ? WHERE booking_id = ?';
        db.query(equipmentQuery, [...equipment, bookingID], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Database error', error: err });
            }
            res.status(200).json({ success: true, message: 'Booking updated successfully' });
        });
    });
});

// Get venue availability endpoint
app.get('/facify/venue-availability/:facilityID', (req, res) => {
    const { facilityID } = req.params;
    const { month, year } = req.query;

    const query = `
        SELECT ei.*, s.status_name, f.facility_name, o.org_name
        FROM event_information ei
        JOIN (
            SELECT bs.booking_id, bs.status_id, bs.date_time
            FROM booking_status bs
            JOIN (
                SELECT booking_id, MAX(date_time) AS max_date_time
                FROM booking_status
                GROUP BY booking_id
            ) latest_status 
            ON bs.booking_id = latest_status.booking_id AND bs.date_time = latest_status.max_date_time
        ) latest_bs 
        ON ei.booking_id = latest_bs.booking_id
        JOIN status s 
        ON latest_bs.status_id = s.status_id
        JOIN facilities f 
        ON ei.facility_id = f.facility_id
        JOIN user o 
        ON ei.org_ID = o.org_ID
        WHERE ei.facility_id = ? 
        AND MONTH(ei.event_date) = ? 
        AND YEAR(ei.event_date) = ?`;

    db.query(query, [facilityID, month, year], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, events: result });
    });
});

// Cancel booking endpoint
app.post('/facify/booking-info/:bookingID/cancel', (req, res) => {
    const { bookingID } = req.params;
    const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = 'INSERT INTO booking_status (booking_id, status_id, date_time, admin_id) VALUES (?, ?, ?, ?)';
    db.query(query, [bookingID, 6, date_time, 1], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }
        res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
    });
});

// Get all bookings with filtered time for admin endpoint
app.get('/facify/admin-home/:adminID', (req, res) => {
    const { adminID } = req.params;
    const { filter } = req.query; // Get filter from dropdown

    let dateCondition = ''; // This will store the condition dynamically

    if (filter === 'Today') {
        dateCondition = `DATE(bs.date_time) = CURDATE()`;
    } else if (filter === 'This Week') {
        dateCondition = `YEARWEEK(bs.date_time, 1) = YEARWEEK(CURDATE(), 1)`;
    } else if (filter === 'This Month') {
        dateCondition = `YEAR(bs.date_time) = YEAR(CURDATE()) AND MONTH(bs.date_time) = MONTH(CURDATE())`;
    } else if (filter === 'This Year') {
        dateCondition = `YEAR(bs.date_time) = YEAR(CURDATE())`;
    } else {
        dateCondition = `1 = 1`;
    }

    const query = `
            SELECT 
                ei.*, 
                f.facility_name, 
                s.status_name, 
                u.org_name,
                u.org_id
            FROM event_information ei
            JOIN facilities f ON ei.facility_id = f.facility_id
            JOIN booking_status bs ON ei.booking_id = bs.booking_id
            JOIN status s ON bs.status_id = s.status_id
            JOIN user u ON ei.org_id = u.org_id
            WHERE bs.date_time = (
                SELECT MAX(date_time) 
                FROM booking_status 
                WHERE booking_status.booking_id = ei.booking_id
            )
            AND ${dateCondition}`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching booking information:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get all bookings with search for admin endpoint
app.get('/facify/admin-bookings/:adminID', (req, res) => {
    const query = `
        SELECT 
            ei.*, 
            f.facility_name, 
            s.status_name, 
            u.org_name,
            u.org_id
        FROM event_information ei
        JOIN facilities f ON ei.facility_id = f.facility_id
        JOIN booking_status bs ON ei.booking_id = bs.booking_id
        JOIN status s ON bs.status_id = s.status_id
        JOIN user u ON ei.org_id = u.org_id
        WHERE bs.date_time = (
            SELECT MAX(date_time) 
            FROM booking_status 
            WHERE booking_status.booking_id = ei.booking_id
        )`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching booking information:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Update booking status endpoint
app.post('/facify/booking-info/:bookingID/:adminID/update-status', (req, res) => {
    const { bookingID, adminID } = req.params;
    const { action } = req.body; 
    const date_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let statusID;

    switch (action) {
        case "For Assessing":
            statusID = 3;
            break;
        case "Approved":
            statusID = 4;
            break;
        case "Denied":
            statusID = 5;
            break;
        default:
            return res.status(400).json({ success: false, message: 'Invalid action type' });
    }

    const statusQuery = `
        INSERT INTO booking_status (booking_id, status_id, date_time, admin_id) 
        VALUES (?, ?, ?, ?)
    `;

    db.query(statusQuery, [bookingID, statusID, date_time, adminID], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err });
        }
        res.status(200).json({ success: true, message: `Booking status updated to "${action}"`, bookingID: bookingID });
    });
});

// Open the requirement for admin endpoint
app.get('/facify/get-file/:bookingID/:requirementID', async (req, res) => {
    try {
        const { bookingID, requirementID } = req.params;
        const query = `SELECT file, file_name FROM requirement WHERE booking_id = ? AND requirement_id = ?`;

        db.query(query, [bookingID, requirementID], (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Database error');
            }

            if (result.length === 0) {
                return res.status(404).send('File not found');
            }

            const fileBuffer = result[0].file;
            const filename = result[0].file_name || "download.pdf";

            console.log(fileBuffer);

            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(Buffer.from(fileBuffer, 'binary')); 
        });
    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).send('Server error');
    }
});