/**
 * Info: Lookup table endpoints.
 * Author: Sushil Thakur
 * Date: 1 October 2023
 */

const express = require("express");
const router = express.Router();
const pool = require('../config/database')
const isAuth = require('../lib/authMiddleware').isAuth;

// Returns cancel reasons
router.get('/', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM group_details WHERE user_id=$1', [req.user.user_id])
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

router.post('/create', isAuth, async (req, res, next) => {
    try {
        const creationDateTime = (new Date()).toISOString();
        const { rows } = await pool.query(`
            INSERT INTO group_details (
                user_id,
                workspace_id,
                group_name,
                group_description,
                group_creation_datetime
            ) VALUES (
                $1, $2, $3, $4, $5
            ) RETURNING group_id, user_id, workspace_id, group_name, group_description, group_creation_datetime
            `,
            [
                req.user.user_id,
                req.body.workspace_id,
                req.body.group_name,
                req.body.group_description,
                creationDateTime
            ]
        );
        // const { rows } = await pool.query('SELECT group_id, group_name, group_description, group_creation_datetime FROM group_details WHERE user_id=$1 AND group_id=$2', [req.user.user_id, newGroupId]);
        res.status(200).json(rows[0]);
    } catch(err) {
        next(err);
    }
})

module.exports = router;