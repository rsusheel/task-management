/**
 * Info: Workspace endpoints.
 * Author: Sushil Thakur
 * Date: 14 November 2023
 */

const express = require("express");
const router = express.Router();
const pool = require('../config/database')
const isAuth = require('../lib/authMiddleware').isAuth;

// Returns the workspaces for the user
router.get('/', isAuth, async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { rows: sentInvites } = await client.query(`SELECT * FROM all_invite_details WHERE requester_details->>'user_id'=$1`, [req.user.user_id])
        const { rows: invites } = await client.query(`SELECT * FROM all_invite_details WHERE requestee_details->>'user_id'=$1 AND accept_status=$2 AND reject_status=$3`, [req.user.user_id, false, false])
        
        await client.query('COMMIT');

        res.status(200).json({invites, sentInvites});
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
});

// Returns the workspace details
router.post('/sendInvite', isAuth, async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const currentDateTime = (new Date()).toISOString();

        const { rows: invitedUser } = await client.query('SELECT user_id from user_details WHERE username=$1 OR email_id=$2', [req.body.requestee_id, req.body.requestee_id])

        await client.query('INSERT INTO invite_details (requester_id, requestee_id, workspace_id, accept_status, reject_status, invite_datetime) VALUES ($1, $2, $3, $4, $5, $6)',
            [req.user.user_id, invitedUser[0].user_id, req.body.workspace_id, false, false, currentDateTime]);
        
        const { rows: sentInvites } = await client.query(`SELECT * FROM all_invite_details WHERE requester_details->>'user_id'=$1`, [req.user.user_id])
        const { rows: invites } = await client.query(`SELECT * FROM all_invite_details WHERE requestee_details->>'user_id'=$1`, [req.user.user_id])

        await client.query('COMMIT');

        res.status(200).json({invites, sentInvites})
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
})

// Creates the workspace for the user
router.post('/acceptInvite', isAuth, async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query('UPDATE workspace_details SET team_members=array_append(team_members, $1) WHERE workspace_id=$2', [req.user.user_id, req.body.workspace_id]);

        await client.query('UPDATE invite_details SET accept_status=$1, reject_status=$2 WHERE invite_id=$3',
            [true, false, req.body.invite_id])

        await client.query('',
            [])

        const { rows: sentInvites } = await client.query(`SELECT * FROM all_invite_details WHERE requester_details->>'user_id'=$1`, [req.user.user_id])
        const { rows: invites } = await client.query(`SELECT * FROM all_invite_details WHERE requestee_details->>'user_id'=$1 AND accept_status=$2 AND reject_status=$3`, [req.user.user_id, false, false])    

        await client.query('COMMIT');

        console.log('aaaaaaaaaaa')

        res.status(200).json({invites, sentInvites});
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
});

router.post('/rejectInvite', isAuth, async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query('UPDATE invite_details SET accept_status=$1, reject_status=$2 WHERE requester_id=$3 AND requestee_id=$4 AND workspace_id=$5',
            [false, true, req.body.requester_id, req.user.user_id, req.body.workspace_id])

        const { rows: sentInvites } = await client.query(`SELECT * FROM all_invite_details WHERE requester_details->>'user_id'=$1`, [req.user.user_id])
        const { rows: invites } = await client.query(`SELECT * FROM all_invite_details WHERE requestee_details->>'user_id'=$1 AND accept_status=$2 AND reject_status=$3`, [req.user.user_id, false, false])    
    
        await client.query('COMMIT');

        res.status(200).json({invites, sentInvites});
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
});

module.exports = router;