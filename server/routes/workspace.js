/**
 * Info: Workspace endpoints.
 * Author: Sushil Thakur
 * Date: 11 August 2023
 */

const express = require("express");
const router = express.Router();
const pool = require('../config/database')
const isAuth = require('../lib/authMiddleware').isAuth;

// Returns the workspaces for the user
router.get('/', isAuth, async (req, res, next) => {
    try {
        const { rows: [defaultWorkspace] } = await pool.query('SELECT default_workspace_id FROM user_preference_details WHERE user_id=$1', [req.user.user_id]);
        const { rows: [workspaceDetails] } = await pool.query('SELECT * FROM workspace_with_groups WHERE workspace_id=$1', [defaultWorkspace.default_workspace_id]);
        res.status(200).json(workspaceDetails);
    } catch (err) {
        next(err);
    }
});

// Returns the workspace details
router.get('/details', isAuth, async (req, res, next) => {
    try {
        // const { rows } = await pool.query(`SELECT wwg.* FROM workspace_with_groups wwg JOIN LATERAL json_array_elements(wwg.admin_users) admin_user ON (admin_user->>'user_id')::int=$1`, [req.user.user_id]);
        const { rows } = await pool.query(`SELECT wwg.* FROM workspace_with_groups wwg JOIN LATERAL json_array_elements(wwg.team_members) team_member ON (team_member->>'user_id')::int=$1`, [req.user.user_id]);

        res.status(200).json(rows)
    } catch (err) { 
        next(err);
    }
});

// Creates the workspace for the user
router.post('/create', isAuth, async (req, res, next) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const creationDateTime = (new Date()).toISOString();

        const {rows: [workspace]} = await client.query('INSERT INTO workspace_details (creator_id, workspace_name, workspace_tagline, workspace_description, workspace_creation_datetime, admin_users, team_members) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING workspace_id',
            [req.user.user_id, req.body.workspace_name, req.body.workspace_tagline, req.body.workspace_description, creationDateTime, [req.user.user_id], [req.user.user_id]
        ]);

        const {rows: [group]} = await client.query('INSERT INTO group_details (user_id, workspace_id, group_name, group_description, group_creation_datetime) VALUES ($1, $2, $3, $4, $5) RETURNING group_id',
            [req.user.user_id, workspace.workspace_id, 'Default', 'Default group', creationDateTime])

        await client.query('INSERT INTO filter_options (user_id, workspace_id, group_ids, task_states, importance, has_sub_task, creation_datetime, creation_dt_operator, target_datetime, target_dt_operator, sorting_field, sorting_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
            [req.user.user_id, workspace.workspace_id, [group.group_id], ['Created', 'In Progress', 'On Hold', 'Re-opened'], ['Low', 'Medium', 'High'], [true, false], beginningDatetime, '>=', targetDatetime, '<=', 'task_state', 'desc']);

        const workspaceDetails = await client.query('SELECT * FROM workspace_with_groups WHERE creator_id=$1 AND workspace_id=$2', [req.user.user_id, workspace.workspace_id])

        await client.query('COMMIT');
        res.status(200).json(workspaceDetails.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
});

router.get('/default', isAuth, async (req, res, next) => {
    try {
        const {rows} = await pool.query('SELECT default_workspace_id FROM user_preference_details WHERE user_id=$1', [req.user.user_id]);
        res.status(200).json(rows[0].default_workspace_id)
    } catch (err) {
        next(err);
    }
})

// Edits the workspace for the user
router.post('/edit/:workspace_id', isAuth, async (req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
})

router.post('/delete/:workspace_id', isAuth, async (req, res, next) => {
    try {
        await pool.query('DELETE FROM sub_task_audit_details WHERE user_id=$1 AND workspace_id=$2', [req.user.user_id, req.params.workspace_id]);

        await pool.query('DELETE FROM sub_task_details WHERE user_id=$1 AND workspace_id=$2', [req.user.user_id, req.params.workspace_id]);

        await pool.query('DELETE FROM task_audit_details WHERE user_id=$1 AND workspace_id=$2', [req.user.user_id, req.params.workspace_id]);

        await pool.query('DELETE FROM task_details WHERE user_id=$1 AND workspace_id=$2', [req.user.user_id, req.params.workspace_id]);

        await pool.query('DELETE FROM workspace_details WHERE user_id=$1 AND workspace_id=$2', [req.user.user_id, req.params.workspace_id]);

    } catch (err) {
        next(err);
    }
});

router.get('/:workspace_id', isAuth, async (req, res, next) => {
    try {
        const { rows: [workspaceDetails] } = await pool.query('SELECT * FROM workspace_with_groups WHERE workspace_id=$1', [req.params.workspace_id]);
        res.status(200).json(workspaceDetails);
    } catch (err) {
        next(err);
    }
});

module.exports = router;