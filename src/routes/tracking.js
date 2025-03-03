import express from 'express';
import pool from '../config/db.js'; //

const router = express.Router();

//  Middleware to Validate Input
const validateTrackingInput = (req, res, next) => {
    const { userId, latitude, longitude } = req.body;

    if (!userId || !latitude || !longitude) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (typeof userId !== 'number' || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Invalid data types. Ensure userId is a number, and latitude & longitude are valid numbers.' });
    }

    next();
};

//  POST Route to Store User Location
router.post('/', validateTrackingInput, async (req, res) => {
    const { userId, latitude, longitude } = req.body;

    try {
        //  Ensure `userId` exists before inserting tracking data
        const userExistsQuery = `SELECT id FROM users WHERE id = $1;`;
        const userCheck = await pool.query(userExistsQuery, [userId]);

        if (userCheck.rows.length === 0) {
            return res.status(400).json({ error: `User with ID ${userId} does not exist.` });
        }

        // Insert new location entry into PostgreSQL
        const query = `
            INSERT INTO team_tracking (user_id, latitude, longitude)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [userId, latitude, longitude];

        const result = await pool.query(query, values);
        console.log(` Location stored for user ${userId}:`, result.rows[0]);

        res.status(200).json({ message: 'Location stored successfully', data: result.rows[0] });
    } catch (error) {
        console.error(' Database error:', error);
        res.status(500).json({ error: 'Failed to store location data' });
    }
});

// GET Route to Retrieve Latest Team Locations
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT user_id, latitude, longitude, timestamp
            FROM team_tracking
            WHERE timestamp = (
                SELECT MAX(timestamp) FROM team_tracking AS sub WHERE sub.user_id = team_tracking.user_id
                )
            ORDER BY timestamp DESC;
        `;

        const result = await pool.query(query);

        res.status(200).json({ teamLocations: result.rows });
    } catch (error) {
        console.error('Error fetching team locations:', error);
        res.status(500).json({ error: 'Failed to retrieve team locations' });
    }
});

export default router;
