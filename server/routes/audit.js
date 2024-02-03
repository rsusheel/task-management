/**
 * Info: Audit endpoints.
 * Author: Sushil Thakur
 * Date: 19 August 2023
 */

const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const isAuth = require('../lib/authMiddleware').isAuth;

// Returns audits for the given task
router.get('/task/:task_number', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM task_audit_details WHERE user_id=$1 AND task_number=$2 ORDER BY action_datetime asc', [req.user.user_id, req.params.task_number]);
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

// Returns audits for the given sub task
router.get('/subtask/:sub_task_number', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM sub_task_audit_details WHERE user_id=$1 AND sub_task_number=$2 ORDER BY action_datetime asc', [req.user.user_id, req.params.task_number]);
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

router.post('/task/:task_number', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('INSERT INTO task_audit_details (user_id, task_number, workspace_id, task_action, task_state_new, task_state_old, task_group_id, task_comment, hold_status, hold_reason, action_datetime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [req.user.user_id, req.params.task_number])
    } catch (err) {
        next(err);
    }
});

router.post('/subtask/:sub_task_number', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('INSERT INTO sub_task_audit_details (user_id, sub_task_number, workspace_id, task_number, sub_task_action, sub_task_state_new, sub_task_state_old, sub_task_group_id, sub_task_comment, hold_status, hold_reason, action_datetime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [req.user.user_id, req.params.sub_task_number]);
    } catch (err) {
        next(err);
    }
});

module.exports = router;