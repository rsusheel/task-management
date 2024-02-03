/**
 * Info: Sub-Tasks endpoints for the logged in user.
 * Author: Sushil Thakur
 * Date: 14 October 2023
 */

const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const { gmtToist } = require("../lib/timeZone");
const isAuth = require('../lib/authMiddleware').isAuth;

// Returns all the task for the user
router.get('/', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM task_details WHERE user_id=$1', [req.user.user_id])
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

// Returns just the task numbers
router.get('/taskNumbers', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT task_number, task_name, task_state FROM task_details WHERE user_id=$1', [req.user.user_id]);
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
})

// Returns the details for the given task in the params
router.get('/:task_number', isAuth, async (req, res, next) => {
    try {
        const query ='SELECT * FROM task_details_view WHERE user_id=$1 AND task_number=$2';
        const { rows } = await pool.query(query, [req.user.user_id, req.params.task_number]);
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
})

// Returns the tasks that are on hold due to the given task in the params
router.get('/:task_number/holding', isAuth, async (req, res, next) => {
    try {
        const {rows} = await pool.query('SELECT * FROM held_task_details WHERE user_id=$1 AND holding_task_number=$2', [req.user.user_id, req.params.task_number])
        res.status(200).json(rows)
    } catch (err) {
        next(err);
    }
})

// Creates the task for the user
router.post('/create', isAuth, async (req, res, next) => {
    try {
        const subTaskNumber = await pool.query('SELECT sub_task_number FROM sub_task_details WHERE user_id=$1 ORDER BY sub_task_number DESC LIMIT 1;', [req.user.user_id])
        let lastSubTaskNumber;
        let newSubTaskNumber;
        if(subTaskNumber.rows.length==0){
            newSubTaskNumber = 'STASK0001';
        } else {
            lastSubTaskNumber = subTaskNumber.rows[0].sub_task_number;
            newSubTaskNumber = lastSubTaskNumber+'C';
            if(parseInt(lastSubTaskNumber.slice(5))<999){
                newSubTaskNumber = 'STASK'+String(parseInt(lastSubTaskNumber.slice(5))+1).padStart(4,'0');
            } else {
                newSubTaskNumber = 'STASK'+String(parseInt(lastSubTaskNumber.slice(5))+1);
            }
        }
        
        const currentDatetime = (new Date()).toISOString();

        const { rows } = await pool.query(
            `INSERT INTO sub_task_details (
                user_id,
                workspace_id,
                sub_task_number,
                task_number,
                sub_task_state,
                sub_task_name,
                sub_task_description,
                hold_status,
                hold_reason,
                cancel_status,
                cancel_reason,
                sub_task_group_id,
                sub_task_importance,
                reference_task,
                target_datetime,
                creation_datetime,
                last_comment,
                assigned_to
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
            [
                req.user.user_id,
                req.body.workspace_id,
                newSubTaskNumber,
                req.body.task_number,
                'Created',
                req.body.sub_task_name,
                req.body.sub_task_description,
                false,
                null,
                false,
                null,
                req.body.sub_task_group_id,
                req.body.sub_task_importance,
                req.body.reference_task,
                req.body.target_datetime,
                currentDatetime,
                null,
                req.body.assigned_to,
            ]
        );

        let subTaskCount = await pool.query('SELECT sub_task_count FROM task_details WHERE user_id=$1 AND task_number=$2', [req.user.user_id, req.body.task_number]);
        subTaskCount = subTaskCount.rows[0].sub_task_count + 1;
        await pool.query('UPDATE task_details SET has_sub_task=$1, sub_task_count=$2 WHERE user_id=$3 AND task_number=$4', [true, subTaskCount, req.user.user_id, req.body.task_number]);
        res.status(200).json(newSubTaskNumber);
    } catch (err) {
        next(err);
    }
})

router.get('/list/:task_number', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT sub_task_number FROM sub_task_details WHERE user_id=$1 AND task_number=$2', [req.user.user_id, req.params.task_number]);
        res.status(200).json(rows);
    } catch(err) {
        next(err);
    }
})

// Updates the task given in the params
router.post('/update/:task_number', isAuth, async (req, res, next) => {
    try {
        const queryPart1 = 'UPDATE task_details SET '
        let queryPart2 = '';
        let i=1;
        let values = [];
        for(const key in req.body){
            const value = req.body[key];
            queryPart2 += key+'=$'+i+', ';
            values.push(value);
            i++;
        }
        queryPart2 = queryPart2.slice(0, -2);
        values.push(req.params.task_number);
        const queryPart3 = ' WHERE task_number=$'+i+';';
        const query = queryPart1 + queryPart2 + queryPart3;

        console.log(query)
        console.log(values)

        const { rows } = await pool.query(query, values);
        res.status(200).json(req.params.task_number);
    } catch (err){
        next(err);
    }
})

module.exports = router;