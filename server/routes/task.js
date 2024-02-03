/**
 * Info: Tasks endpoints for the logged in user.
 * Author: Sushil Thakur
 * Date: 11 August 2023
 */

const express = require("express");
const router = express.Router();
const pool = require('../config/database');
const { gmtToist } = require("../lib/timeZone");
const isAuth = require('../lib/authMiddleware').isAuth;

// Returns all the task for the user
router.get('/', isAuth, async (req, res, next) => {
    try {
        // const { rows } = await pool.query('SELECT default_workspace_id FROM task_details WHERE $1 IN (team_members)', [req.user.user_id])
        const {rows: [workspace]} = await pool.query('SELECT * FROM user_preference_details WHERE user_id=$1', [req.user.user_id]);
        const {rows: [options]}= await pool.query('SELECT * FROM filter_options WHERE user_id=$1 AND workspace_id=$2',
            [req.user.user_id, workspace.default_workspace_id]);
        const query = `
            SELECT task_number, workspace_id, task_state, assigned_to, task_name, task_description, last_comment, group_name, has_sub_task, sub_task_count, sub_task_details 
            FROM task_details_view 
            WHERE $1=ANY(team_members) 
            AND workspace_id=$2
            AND task_group_id = ANY($3::integer[]) 
            AND task_state = ANY($4::text[]) 
            AND task_importance = ANY($5::text[]) 
            AND has_sub_task = ANY($6::boolean[]) 
            AND creation_datetime ${options.creation_dt_operator} $7
            AND target_datetime ${options.target_dt_operator} $8
            ORDER BY $9 ${options.sorting_order};
        `;
        const { rows } = await pool.query(
            query,
            [
                req.user.user_id,
                workspace.default_workspace_id,
                options.group_ids,
                options.task_states,
                options.importance,
                options.has_sub_task,
                options.creation_datetime,
                options.target_datetime,
                options.sorting_field
            ]);

        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

// Returns just the task numbers
router.get('/taskNumbers', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT task_number, task_name, task_state FROM task_details WHERE $1 IN (team_members)', [req.user.user_id]);
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
})

router.post('/filter', isAuth, async (req, res, next) => {
    try {
        const groupIdArray = req.body.group_ids.split(',');
        const taskStatesArray = req.body.task_states.split(',');
        const importanceArray = req.body.task_importance.split(',');
        const hasSubTaskArray = req.body.has_sub_task.split(',');

        const query = `
            SELECT task_number, workspace_id, task_state, assigned_to, task_name, task_description, last_comment, group_name, has_sub_task, sub_task_count, sub_task_details 
            FROM task_details_view 
            WHERE $1=ANY(team_members) 
            AND workspace_id=$2
            AND task_group_id = ANY($3::integer[]) 
            AND task_state = ANY($4::text[]) 
            AND task_importance = ANY($5::text[]) 
            AND has_sub_task = ANY($6::boolean[]) 
            AND creation_datetime ${req.body.creation_datetime_operator} $7
            AND target_datetime ${req.body.target_datetime_operator} $8
            ORDER BY $9 ${req.body.order_sequence};
        `;
        const { rows } = await pool.query(
            query,
            [
                req.user.user_id,
                req.body.workspace_id,
                groupIdArray,
                taskStatesArray,
                importanceArray,
                hasSubTaskArray,
                req.body.creation_datetime,
                req.body.target_datetime,
                req.body.order_field
            ]);
        res.status(200).json(rows);
    } catch(err) {
        next(err);
    }
});

// Creates the task for the user
router.post('/create', isAuth, async (req, res, next) => {
    try {
        const taskNumber = await pool.query('SELECT task_number FROM task_details WHERE workspace_id=$1 ORDER BY task_number DESC LIMIT 1;', [req.body.workspace_id])

        let lastTaskNumber;
        let newTaskNumber;

        if(taskNumber.rows.length==0){
            newTaskNumber = 'TASK0001'
        } else {
            lastTaskNumber = taskNumber.rows[0].task_number;
            newTaskNumber = lastTaskNumber+'C';
            if(parseInt(lastTaskNumber.slice(4))<999){
                newTaskNumber = 'TASK'+String(parseInt(lastTaskNumber.slice(4))+1).padStart(4,'0');
            } else {
                newTaskNumber = 'TASK'+String(parseInt(lastTaskNumber.slice(4))+1);
            }
        }

        const currentDatetime = (new Date()).toISOString();
        console.log(currentDatetime)
        console.log(req.body.target_datetime)

        const { rows } = await pool.query(
            'INSERT INTO task_details (user_id, workspace_id, task_number, task_state, task_name, task_description, assigned_to, hold_status, hold_reason, cancel_status, cancel_reason, task_group_id, task_importance, reference_task, target_datetime, has_sub_task, sub_task_count, creation_datetime, last_comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)',
            [
                req.user.user_id,
                req.body.workspace_id,
                newTaskNumber,
                'Created',
                req.body.task_name,
                req.body.task_description,
                req.body.assigned_to,
                false,
                null,
                false,
                null,
                req.body.task_group_id,
                req.body.task_importance,
                req.body.reference_task,
                req.body.target_datetime,
                false,
                0,
                currentDatetime,
                null,
            ]
        );
        res.status(200).json(newTaskNumber);
    } catch (err) {
        next(err);
    }
});

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

// Deletes the task given in the params
router.post('/delete/:task_number', isAuth, async (req, res, next) => {
    try {
        await pool.query('DELETE FROM held_task_details WHERE user_id=$1 AND holding_task_number=$2', [req.user.user_id, req.params.task_number])

        // update the held task state

        await pool.query('DELETE FROM sub_task_audit_details WHERE user_id=$1 AND task_number=$2', [req.user.user_id, req.params.task_number]);

        await pool.query('DELETE FROM sub_task_details WHERE user_id=$1 AND task_number=$2', [req.user.user_id, req.params.task_number]);

        await pool.query('DELETE FROM task_audit_details WHERE user_id=$1 AND task_number=$2', [req.user.user_id, req.params.task_number]);

        await pool.query('DELETE FROM task_details WHERE user_id=$1 AND task_number=$2', [req.user.user_id, req.params.task_number]);

        res.status(200).json({message: 'Task has been deleted.'});
    } catch (err) {
        next(err);
    }
})

// Returns the tasks for the given workspace
router.get('/workspace/:workspace_id', isAuth, async (req, res, next) => {
    try {
        const {rows} = await pool.query('SELECT * FROM task_details WHERE workspace_id=$1', [req.params.workspace_id])
        res.status(200).json(rows)
    } catch (err) {
        next(err);
    }
})

router.get('/group/:group_id', isAuth, async (req, res, next) => {
    try {
        const {rows} = await pool.query('SELECT task_number, task_name, task_state FROM task_details WHERE user_id=$1 AND task_group_id=$2', [req.user.user_id, req.params.group_id])
        res.status(200).json(rows)
    } catch (err) {
        next(err);
    }
})

// Returns the details for the given task in the params
router.post('/:task_number', isAuth, async (req, res, next) => {
    try {
        const query ='SELECT * FROM task_details_view WHERE workspace_id=$1 AND task_number=$2';
        const { rows } = await pool.query(query, [req.body.workspace_id, req.params.task_number]);
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
});

// router.get('/:task_number/workspace', isAuth, async (req, res, next) => {
//     try {
//         const { rows } = await pool.query('SELECT * FROM workspace_details WHERE', []);
//     } catch (err) {
//         next(err);
//     }
// })

module.exports = router;