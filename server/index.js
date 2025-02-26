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

// Create connection
const app = express();
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'facify',
    port: '3306'
    });

// Middleware
app.use(express.static(path.join(__dirname, '../dist')));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log('Server is running on port 3000');
    });

app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Login endpoint
// Centralized Error Handling Function
const handleError = (res, error, message = 'Database error', statusCode = 500) => {
    console.error(`${message}:`, error);
    res.status(statusCode).json({ success: false, message, error: error.message || error });
};

// Login Endpoint
app.post('/facify/login/:type', (req, res) => {
    try {
        const { email, password } = req.body;
        const { type } = req.params;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        if (type !== 'Admin' && type !== 'Organization') {
            return res.status(400).json({ success: false, message: 'Invalid login type' });
        }

        const query = type === 'Admin'
            ? 'SELECT * FROM facility WHERE email = ? AND password = ?'
            : 'SELECT * FROM user WHERE email = ? AND password = ?';

        db.query(query, [email, password], (err, result) => {
            if (err) return handleError(res, err, 'Database query error');

            if (result.length === 0) {
                return res.status(401).json({ success: false, message: 'Invalid credentials' });
            }

            const user = result[0];

            let imageBase64 = null;
            if (user.org_image || user.admin_image) {
                const imageBuffer = user.org_image || user.admin_image;
                imageBase64 = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;
            }

            res.json({
                success: true,
                org_id: user.org_id || null,
                org_name: user.org_name || null,
                admin_id: user.admin_id || null,
                admin_name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null,
                image: imageBase64,
                role: type,
                bookings_num: user.bookings_num || null,
                handled_bookings: user.handled_bookings || null
            });
        });
    } catch (error) {
        handleError(res, error, 'Unexpected error during login');
    }
});

// Get bookings endpoint
app.get('/facify/bookings/:orgID', (req, res) => {
    try {
        const { orgID } = req.params;

        if (!orgID) {
            return res.status(400).json({ success: false, message: 'Organization ID is required' });
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
                ) latest_status ON bs.booking_id = latest_status.booking_id 
                AND bs.date_time = latest_status.max_date_time
            ) latest_bs ON ei.booking_id = latest_bs.booking_id
            JOIN status s ON latest_bs.status_id = s.status_id
            JOIN user u ON ei.org_id = u.org_id
            WHERE ei.org_id = ?`;

        db.query(query, [orgID], (err, result) => {
            if (err) return handleError(res, err, 'Error retrieving bookings');

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: 'No bookings found for this organization' });
            }

            res.status(200).json({ success: true, bookings: result });
        });

    } catch (error) {
        handleError(res, error, 'Unexpected error while retrieving bookings');
    }
});

// Get booking info endpoint
app.get('/facify/booking-info/:orgID/:bookingID', (req, res) => {
    try {
        const { orgID, bookingID } = req.params;

        if (!orgID || !bookingID) {
            return res.status(400).json({ success: false, message: 'Organization ID and Booking ID are required' });
        }

        const query = `
            SELECT 
                event_information.*, 
                facilities.facility_name, 
                status.status_name, 
                user.org_name,
                event_equipment.*,
                denied_booking_reasons.reason AS denied_reason,
                denied_booking_reasons.reason_description AS denied_reason_description
            FROM event_information 
            JOIN facilities ON event_information.facility_id = facilities.facility_id 
            JOIN (
                SELECT bs.booking_id, bs.status_id, bs.date_time
                FROM booking_status bs
                JOIN (
                    SELECT booking_id, MAX(date_time) AS max_date_time
                    FROM booking_status
                    GROUP BY booking_id
                ) latest_status 
                ON bs.booking_id = latest_status.booking_id 
                AND bs.date_time = latest_status.max_date_time
            ) latest_bs 
            ON event_information.booking_id = latest_bs.booking_id
            JOIN status ON latest_bs.status_id = status.status_id 
            JOIN user ON event_information.org_id = user.org_id
            LEFT JOIN event_equipment ON event_information.booking_id = event_equipment.booking_id
            LEFT JOIN denied_booking ON event_information.booking_id = denied_booking.booking_id
            LEFT JOIN denied_booking_reasons ON denied_booking.reason_id = denied_booking_reasons.reason_id
            WHERE event_information.booking_id = ? AND event_information.org_id = ?
            GROUP BY event_information.booking_id;`;

        db.query(query, [bookingID, orgID], (err, result) => {
            if (err) return handleError(res, err, 'Error fetching booking information');

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: 'No booking found with the provided details' });
            }

            res.status(200).json({ success: true, bookingInfo: result[0] });
        });

    } catch (error) {
        handleError(res, error, 'Unexpected error while retrieving booking information');
    }
});

// Storage for uploaded files
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, './public/files'),
        filename: (req, file, cb) => cb(null, file.originalname)
    })
});

// Upload requirements endpoint
app.post('/facify/booking-info/:bookingID/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

        console.log("File uploaded:", req.file);

        const { bookingID } = req.params;
        const filePath = req.file.path;
        const filename = req.file.filename;
        const date_time = new Date(Date.now() + 8 * 60 * 60000).toISOString().slice(0, 19).replace("T", " ");

        fs.readFile(filePath, (err, fileData) => {
            if (err) return handleError(res, err, 'File read error');

            const query = 'INSERT INTO requirement (booking_id, file_name, file, date_time_submitted) VALUES (?, ?, ?, ?)';
            db.query(query, [bookingID, filename, fileData, date_time], (err) => {
                if (err) return handleError(res, err, 'Database error while inserting requirement');

                const checkReqQuery = 'SELECT COUNT(*) AS count FROM requirement WHERE booking_id = ?';
                db.query(checkReqQuery, [bookingID], (err, result) => {
                    if (err) return handleError(res, err, 'Database error while counting requirements');

                    const count = result[0]?.count || 0;
                    const totalReqs = 3;

                    if (count >= totalReqs) {
                        const updateStatusQuery = `
                            INSERT INTO booking_status (booking_id, status_id, date_time) 
                            VALUES (?, ?, ?) 
                            ON DUPLICATE KEY UPDATE status_id = VALUES(status_id), admin_id = VALUES(admin_id);`;

                        db.query(updateStatusQuery, [bookingID, 2, date_time], (err) => {
                            if (err) return handleError(res, err, 'Database error while updating status');

                            return res.status(200).json({ success: true, message: 'File uploaded and status updated' });
                        });
                    } else {
                        return res.status(200).json({ success: true, message: 'File uploaded successfully' });
                    }
                });
            });
        });
    } catch (error) {
        return handleError(res, error, 'Unexpected error during file upload');
    }
});

// Get requirements endpoint
app.get('/facify/booking-info/:orgID/:bookingID/requirements', async (req, res) => {
    try {
        const { orgID, bookingID } = req.params;

        if (!orgID || !bookingID) {
            return handleError(res, new Error('Missing orgID or bookingID'), 'Missing required parameters', 400);
        }

        const query = `
            SELECT r.*, OCTET_LENGTH(r.file) AS file_size 
            FROM requirement r
            JOIN event_information e ON r.booking_id = e.booking_id
            WHERE r.booking_id = ? AND e.org_id = ?`;

        db.query(query, [bookingID, orgID], (err, result) => {
            if (err) {
                return handleError(res, err, 'Database error while fetching requirements');
            }

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: 'No requirements found' });
            }
            res.status(200).json({ success: true, requirements: result });
        });
    } catch (error) {
        return handleError(res, error, 'Unexpected error during fetching of requirements');
    }
});


// Get update logs endpoint
app.get('/facify/booking-info/:orgID/:bookingID/logs', async (req, res) => {
    try {
        const { orgID, bookingID } = req.params;

        if (!bookingID || !orgID) {
            return handleError(res, new Error('Missing parameters'), 'No bookingID or orgID provided', 400);
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
            if (err) return handleError(res, err, 'Database error while fetching update logs');

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: 'No logs found' });
            }

            res.status(200).json({ success: true, logs: result });
        });
    } catch (error) {
        return handleError(res, error, 'Unexpected error during fetching of update logs');
    }
});



// Create booking endpoint
app.post('/facify/venue-booking/:orgID/:facilityID/create', async (req, res) => {
    try {
        const { orgID, facilityID } = req.params;
        const { eventDate, eventStart, eventEnd, activityTitle, attendance, speakerName = null, equipment = [], status = 'pencil' } = req.body;

        if (!eventDate || !eventStart || !eventEnd || !activityTitle || !attendance) {
            return handleError(res, new Error('Missing required fields'), 'Event date, start time, end time, activity title, and attendance are required', 400);
        }

        const bookingDate = new Date(Date.now() + 8 * 60 * 60000).toISOString().slice(0, 10);
        const bookingTime = new Date(Date.now() + 8 * 60 * 60000).toISOString().slice(11, 19);

        const eventQuery = `
            INSERT INTO event_information (event_date, event_start, event_end, activity_title, org_id, facility_id, booking_date, booking_time, expected_attendance, speaker_name) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(eventQuery, [eventDate, eventStart, eventEnd, activityTitle, orgID, facilityID, bookingDate, bookingTime, attendance, speakerName], (err, result) => {
            if (err) return handleError(res, err, 'Error creating booking information');

            const bookingID = result.insertId;

            if (equipment.length > 0) {
                const equipmentQuery = `
                    INSERT INTO event_equipment (booking_id, tables, chairs, bulletin_boards, speaker, microphone, flagpole, podium, platform, electrician, janitor) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                db.query(equipmentQuery, [bookingID, ...equipment], (err) => {
                    if (err) return handleError(res, err, 'Error creating equipment information');
                });
            }

            const date_time = `${bookingDate} ${bookingTime}`;
            const statusID = status === 'pencil' ? 1 : 2;

            const statusQuery = `
                INSERT INTO booking_status (booking_id, status_id, date_time) 
                VALUES (?, ?, ?)`;

            db.query(statusQuery, [bookingID, statusID, date_time], (err) => {
                if (err) return handleError(res, err, 'Error updating booking status');

                res.status(200).json({ success: true, message: 'Booking created successfully', bookingID });
            });
        });

    } catch (error) {
        return handleError(res, error, 'Unexpected error creating venue booking');
    }
});


// Update booking endpoint
app.put('/facify/booking-info/:bookingID/update', async (req, res) => {
    try {
        const { bookingID } = req.params;
        const { eventDate, eventStart, eventEnd, activityTitle, attendance, speakerName, equipment } = req.body;

        if (!bookingID || !eventDate || !eventStart || !eventEnd || !activityTitle || !attendance) {
            return handleError(res, new Error('Missing required fields'), 'Booking ID, event details, and attendance are required', 400);
        }

        // Update event information
        const query = `
            UPDATE event_information 
            SET event_date = ?, event_start = ?, event_end = ?, activity_title = ?, expected_attendance = ?, speaker_name = ? 
            WHERE booking_id = ?`;
        
        db.query(query, [eventDate, eventStart, eventEnd, activityTitle, attendance, speakerName || null, bookingID], (err, result) => {
            if (err) return handleError(res, err, 'Error updating booking information');

            if (!equipment || !Array.isArray(equipment) || equipment.length < 10) {
                return res.status(200).json({ success: true, message: 'Booking updated successfully (no equipment update)' });
            }

            const equipmentQuery = `
                UPDATE event_equipment 
                SET tables = ?, chairs = ?, bulletin_boards = ?, speaker = ?, microphone = ?, flagpole = ?, podium = ?, platform = ?, electrician = ?, janitor = ? 
                WHERE booking_id = ?`;

            db.query(equipmentQuery, [...equipment, bookingID], (err, result) => {
                if (err) return handleError(res, err, 'Error updating equipment information');
                res.status(200).json({ success: true, message: 'Booking and equipment updated successfully' });
            });
        });
    } catch (error) {
        return handleError(res, error, 'Unexpected error during updating of booking information');
    }
});


// Get venue availability endpoint
app.get('/facify/venue-availability/:facilityID', async (req, res) => {
    try {
        const { facilityID } = req.params;
        const { month, year } = req.query;

        if (!facilityID || !month || !year) {
            return handleError(res, new Error('Missing required parameters'), 'Facility ID, month, and year are required', 400);
        }

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
            ON ei.org_id = o.org_id
            WHERE ei.facility_id = ? 
            AND MONTH(ei.event_date) = ? 
            AND YEAR(ei.event_date) = ?`;

        db.query(query, [facilityID, month, year], (err, result) => {
            if (err) return handleError(res, err, 'Error fetching venue availability');
            res.status(200).json({ success: true, events: result });
        });
    } catch (error) {
        return handleError(res, error, 'Unexpected error during fetching of venue availability');
    }
});


// Cancel booking endpoint
app.post('/facify/booking-info/:bookingID/cancel', async (req, res) => {
    try {
        const { bookingID } = req.params;

        if (!bookingID) {
            return handleError(res, new Error('Booking ID is required'), 'No booking ID provided', 400);
        }

        const date_time = new Date(Date.now() + 8 * 60 * 60000).toISOString().slice(0, 19).replace("T", " ");

        const query = `
            INSERT INTO booking_status (booking_id, status_id, date_time) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE status_id = VALUES(status_id), date_time = VALUES(date_time)`;

        db.query(query, [bookingID, 6, date_time], (err, result) => {
            if (err) return handleError(res, err, 'Error updating booking status');
            res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
        });
    } catch (error) {
        return handleError(res, error, 'Unexpected error during booking cancellation');
    }
});

// Get all bookings with filtered time for admin endpoint
app.get('/facify/admin-home/:adminID', async (req, res) => {
    try {
        const { adminID } = req.params;
        const { filter } = req.query; 

        if (!adminID) {
            return handleError(res, new Error('Admin ID is required'), 'No Admin ID provided', 400);
        }

        const filterConditions = {
            'Today': `DATE(ei.event_date) = CURDATE()`,
            'This Week': `YEARWEEK(ei.event_date, 1) = YEARWEEK(CURDATE(), 1)`,
            'This Month': `YEAR(ei.event_date) = YEAR(CURDATE()) AND MONTH(ei.event_date) = MONTH(CURDATE())`,
            'This Year': `YEAR(ei.event_date) = YEAR(CURDATE())`
        };

        const dateCondition = filterConditions[filter] || `1 = 1`; // Default: No filter applied

        const query = 
            `SELECT 
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
                SELECT MAX(bs2.date_time) 
                FROM booking_status bs2
                WHERE ei.booking_id = bs2.booking_id
            )
            AND ${dateCondition}`;

        db.query(query, (err, results) => {
            if (err) return handleError(res, err, 'Error fetching admin bookings');
            res.status(200).json(results);
        });
    } catch (error) {
        return handleError(res, error, 'Unexpected server error', 500);
    }
});


// Get all bookings with search for admin endpoint
app.get('/facify/admin-bookings/:adminID', async (req, res) => {
    try {
        const { adminID } = req.params;

        if (!adminID) {
            return handleError(res, new Error('Admin ID is required'), 'No Admin ID provided', 400);
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
                SELECT MAX(bs.date_time) 
                FROM booking_status bs
                WHERE ei.booking_id = bs.booking_id
            ) ORDER BY ei.booking_id ASC`;

        db.query(query, (err, results) => {
            if (err) return handleError(res, err, 'Error fetching admin bookings');
            res.status(200).json(results);
        });
    } catch (error) {
        return handleError(res, error, 'Unexpected error fetching admin bookings');
    }
});

// Update booking status endpoint
app.post('/facify/booking-info/:bookingID/:adminID/update-status', async (req, res) => {
    try {
        const { bookingID, adminID } = req.params;
        const { action } = req.body;

        if (!bookingID || !adminID) {
            return handleError(res, new Error('Missing bookingID or adminID'), 'Booking ID and Admin ID are required', 400);
        }
        if (!action) {
            return handleError(res, new Error('Missing action type'), 'Action type is required', 400);
        }

        const date_time = new Date(Date.now() + 8 * 60 * 60000).toISOString().slice(0, 19).replace("T", " ");

        const statusMap = {
            "For Assessing": 3,
            "Approved": 4,
            "Denied": 5
        };

        const statusID = statusMap[action];

        if (!statusID) {
            return handleError(res, new Error('Invalid action type'), 'Invalid action type', 400);
        }

        const statusQuery = `
            INSERT INTO booking_status (booking_id, status_id, date_time, admin_id) 
            VALUES (?, ?, ?, ?)`;

        db.query(statusQuery, [bookingID, statusID, date_time, adminID], (err, result) => {
            if (err) return handleError(res, err, 'Error updating booking status');
            res.status(200).json({ success: true, message: `Booking status updated to "${action}"`, bookingID });
        });

    } catch (error) {
        return handleError(res, error, 'Unexpected error updating booking status');
    }
});

// Open the requirement for admin endpoint
app.get('/facify/get-file/:bookingID/:requirementID', async (req, res) => {
    try {
        const { bookingID, requirementID } = req.params;

        if (!bookingID || !requirementID) {
            return handleError(res, new Error('Missing parameters'), 'Booking ID and Requirement ID are required', 400);
        }

        const query = `SELECT file, file_name FROM requirement WHERE booking_id = ? AND requirement_id = ?`;

        db.query(query, [bookingID, requirementID], (err, result) => {
            if (err) return handleError(res, err, 'Error fetching file');

            if (!result.length) {
                return handleError(res, new Error('File not found'), 'File not found', 404);
            }

            const fileBuffer = result[0].file;
            const filename = result[0].file_name || "download.pdf";

            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(Buffer.from(fileBuffer, 'binary'));
        });

    } catch (error) {
        return handleError(res, error, 'Unexpected error fetching file');
    }
});

app.post("/facify/booking-info/:bookingID/deny", async (req, res) => {
    try {
        const { bookingID } = req.params; 
        const { reasonID } = req.body; 

        if (!bookingID || !reasonID) {
            return res.status(400).json({ success: false, message: "Booking ID and Reason ID are required" });
        }

        // Insert or update the denial reason in the `denied_booking` table
        const query = `
            INSERT INTO denied_booking (booking_id, reason_id, created_at) 
            VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE reason_id = VALUES(reason_id), created_at = NOW();`;

        db.query(query, [bookingID, reasonID], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ success: false, message: "Database error while denying booking" });
            }

            const fetchReasonQuery = `SELECT reason, reason_description FROM denied_booking_reasons WHERE reason_id = ?`;
            db.query(fetchReasonQuery, [reasonID], (err, reasonResult) => {
                if (err) {
                    console.error("Error fetching denied reason:", err);
                    return res.status(500).json({ success: false, message: "Error fetching denied reason" });
                }

                if (reasonResult.length === 0) {
                    return res.status(404).json({ success: false, message: "Denied reason not found" });
                }

                const deniedReason = reasonResult[0];

                res.status(200).json({
                    success: true,
                    message: "Booking denied successfully",
                    denied_reason: deniedReason.reason,
                    denied_reason_description: deniedReason.reason_description
                });
            });
        });

    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ success: false, message: "Unexpected error during booking denial" });
    }
});