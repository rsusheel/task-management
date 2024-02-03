/**
 * Info: Lookup table endpoints.
 * Author: Sushil Thakur
 * Date: 29 September 2023
 */

const express = require("express");
const router = express.Router();
const pool = require('../config/database')
const isAuth = require('../lib/authMiddleware').isAuth;

// Returns cancel reasons
router.get('/', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT * FROM user_preference_details WHERE user_id=$1', [req.user.user_id])
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

router.post('/update/workspace/:workspace_id', isAuth, async (req, res, next) => {
    try {
        const { rows } = await pool.query('UPDATE user_preference_details SET default_workspace_id=$1 WHERE user_id=$2;', [req.params.workspace_id, req.user.user_id])
    } catch {
        next(err);
    }
})

router.get('/filterOptions', isAuth, async (req, res, next) => {
    try {
        let workspaceId = await pool.query('SELECT default_workspace_id FROM user_preference_details WHERE user_id=$1', [req.user.user_id]);
        workspaceId=workspaceId.rows[0].default_workspace_id;

        // let groupIds = await pool.query('SELECT ARRAY(SELECT group_id FROM group_details WHERE workspace_id=$1) AS group_id', [workspaceId]);
        // groupIds=groupIds.rows[0].group_id;

        // let targetDatetime = new Date();
        // targetDatetime.setDate(targetDatetime.getDate() + 15);
        // const beginningDatetime = new Date(0);

        // console.log(beginningDatetime.getHours())

        const {rows: [options]} = await pool.query('SELECT * FROM filter_options WHERE user_id=$1 AND workspace_id=$2', [req.user.user_id, workspaceId])

        let filterOptions = {
            workspace_id: workspaceId,
            group_ids: options.group_ids,
            task_states: options.task_states,
            importance: options.importance,
            creation_datetime: {
                datetime: options.creation_datetime,
                operator: options.creation_dt_operator
            },
            target_datetime: {
                datetime: options.target_datetime,
                operator: options.target_dt_operator
            },
            has_sub_task: options.has_sub_task,
            order: {
                field: options.sorting_field,
                sequence: options.sorting_order
            },
        };
        res.status(200).json(filterOptions);
    } catch(err) {
        next(err);
    }
})

module.exports = router;