/**
 * Info: Lookup table endpoints.
 * Author: Sushil Thakur
 * Date: 11 August 2023
 */

const express = require("express");
const router = express.Router();
const pool = require('../config/database')
const isAuth = require('../lib/authMiddleware').isAuth;

// Returns all lookup items
router.get('/all', isAuth, async (req, res, next) => {
    try {
        const makeArray = (string) => {
            return string
                .replace(/[{}]/g, '') // Remove curly braces
                .split(',')
                .map(value => value.trim().replace(/["\\]/g, '')); // Remove double quotes and backslashes, and trim whitespace
        }

        const query = `
            SELECT 
                (SELECT ARRAY(SELECT state FROM lookup_task_states)) AS task_states,
                (SELECT ARRAY(SELECT reason FROM lookup_cancel_reasons)) AS cancel_reasons,
                (SELECT ARRAY(SELECT reason FROM lookup_hold_reasons)) AS hold_reasons,
                (SELECT ARRAY(SELECT importance FROM lookup_importance_divisions)) AS importance_divisions,
                (SELECT ARRAY(SELECT theme_name FROM lookup_app_themes)) AS app_themes;
            `;

        const { rows } = await pool.query(query);

        const lookupValues = {
            task_states: makeArray(rows[0].task_states),
            cancel_reasons: makeArray(rows[0].cancel_reasons),
            hold_reasons: makeArray(rows[0].hold_reasons),
            importance_divisions: makeArray(rows[0].importance_divisions),
            themes: makeArray(rows[0].app_themes),
            boolean: [true, false]
        }

        res.status(200).json(lookupValues);
    } catch (err) {
        next(err);
    }
})

// Returns cancel reasons
router.get('/cancel/reasons', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM lookup_cancel_reasons')
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

// Returns hold reasons
router.get('/hold/reasons', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM lookup_hold_reasons')
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

// Returns importance divisions
router.get('/importance/divisions', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM lookup_importance_divisions')
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

// Returns task actions
router.get('/task/actions', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM lookup_task_actions')
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

// Returns task states
router.get('/task/states', isAuth, async (req, res, next) => {
    try{
        const { rows } = await pool.query('SELECT * FROM lookup_task_states')
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

module.exports = router;