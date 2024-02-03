-- Application: Todo App v1.0
-- Info: This script contains the queries to create the tables and relationships.
-- Start Date: 6 August 2023
-- Author: Sushil Thakur (thesusheelthakur@gmail.com)


-- Domains
create domain dt_description as varchar(2048);
create domain dt_short_description as varchar(200);
create domain dt_name as varchar(100);
create domain dt_task_number as varchar(20);
create domain dt_task_name as varchar(200);
create domain dt_json as varchar(1024);

-- Session table
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Lookup tables

-- lookup for the states that a task/subtask can be in.
CREATE TABLE lookup_task_states (
    state dt_name PRIMARY KEY,
    description dt_short_description not null
);

-- Lookup for the hold reasons that a task/subtask can be in.
CREATE TABLE lookup_hold_reasons (
    reason dt_name PRIMARY KEY,
    description dt_short_description not null
);

-- Lookup for the importance divisions of tasks and subtasks.
CREATE TABLE lookup_importance_divisions (
    importance dt_name PRIMARY KEY,
    description dt_short_description not null
);

-- Lookup for the task/subtask actions for the audit details.
create table lookup_task_actions (
	task_action dt_name primary key,
	description dt_short_description not null
);

-- Lookup for the cancel reasons for task/subtask.
create table lookup_cancel_reasons (
	reason dt_name primary key,
	description dt_short_description not null
);

create table lookup_app_themes (
	theme_name dt_name primary key,
	theme_colors_json dt_json null
);


-- Data tables

-- Contains all the user details.
create table user_details (
	user_id serial primary key,
	username varchar(30) not null,
	email_id varchar(100) not null,
	first_name varchar(100) not null,
	last_name varchar(100) null,
	password_hash varchar(1024) not null,
	salt varchar(1024) not null,
	creation_datetime timestamp with time zone not null,
	profile_icon bytea null,
	
	unique (username),
	unique (email_id)
);

select setval('user_details_user_id_seq', 1000, false);

-- Email verification table
create table email_verification_details (
	user_id serial primary key,
	email_id varchar(100) not null,
	verification_code varchar(20) not null,
	code_send_datetime timestamp with time zone not null,
	email_verified bool not null,
	
	constraint fk_user_id
		foreign key (user_id)
		references user_details(user_id),
	
	constraint fk_email_id
		foreign key (email_id)
		references user_details(email_id)
);

-- Contains workspace details for all the users throughout the application.
create table workspace_details (
	workspace_id serial primary key,
	creator_id int not null,
	workspace_name dt_name not null,
	workspace_tagline dt_short_description null,
	workspace_description dt_description null,
	workspace_creation_datetime timestamp with time zone not null,
	admin_users integer[] null,
	team_members integer[] null,
	workspace_icon bytea null,
	
	constraint fk_creator_id
		foreign key (creator_id)
		references user_details(user_id)
);

select setval('workspace_details_workspace_id_seq', 1000, false);


-- New edits
-- Progressing

create table invite_details (
	invite_id serial not null,
	requester_id int not null,
	requestee_id int not null,
	workspace_id int not null,
	accept_status bool not null,
	reject_status bool not null,
	invite_datetime timestamp with time zone not null,
	
	primary key (requester_id, requestee_id, workspace_id),
	
	constraint fk_requester_id
		foreign key (requester_id)
		references user_details(user_id),
		
	constraint fk_requestee_id
		foreign key (requestee_id)
		references user_details(user_id),
		
	constraint fk_workspace_id
		foreign key (workspace_id)
		references workspace_details(workspace_id)
);

select setval('invite_details_invite_id_seq', 1000, false);

-- Contains ser preferences details state for all the users.
create table user_preference_details (
	user_id int primary key,
	default_workspace_id serial not null,
	app_theme varchar(20) not null,
	app_icon bytea null,
	app_perspective varchar(20) null,
	
	constraint fk_user_id
		foreign key (user_id)
		references user_details(user_id),
	
	constraint fk_default_workspace_id
		foreign key (default_workspace_id)
		references workspace_details(workspace_id)
);

-- Contains all the user and their group details
create table group_details (
	group_id serial primary key,
	user_id int not null,
	workspace_id int not null,
	group_name dt_name not null,
	group_description dt_description null,
	group_creation_datetime timestamp with time zone not null,
	
	constraint fk_user_id
		foreign key (user_id)
		references user_details(user_id),
		
	constraint fk_workspace_id
		foreign key (workspace_id)
		references workspace_details(workspace_id)
);

select setval('group_details_group_id_seq', 1000, false);

-- Contains all the task details for all users and workspaces throughout the application.
create table task_details (
	user_id int not null,
	workspace_id int not null,
	task_number dt_task_number not null,
	task_state dt_name not null,
	task_name dt_task_name not null,
	task_description dt_description null,
	assigned_to int not null,
	hold_status bool not null,
	hold_reason dt_name null,
	cancel_status bool not null,
	cancel_reason dt_name null,
	task_group_id int not null,
	task_importance dt_name not null,
	reference_task dt_task_number null,
	target_datetime timestamp with time zone not null,
	has_sub_task bool not null,
	sub_task_count int null,
	creation_datetime timestamp with time zone not null,
	completion_datetime timestamp with time zone null,
	last_comment dt_description null,
	
	primary key (workspace_id, task_number),
	
	constraint fk_user_id
		foreign key (user_id)
		references user_details(user_id),
	
	constraint fk_workspace_id
		foreign key (workspace_id)
		references workspace_details(workspace_id),
		
	constraint fk_task_state
		foreign key (task_state)
		references lookup_task_states(state),
		
	constraint fk_assigned_to
		foreign key (assigned_to)
		references user_details(user_id),
		
	constraint fk_hold_reason
		foreign key (hold_reason)
		references lookup_hold_reasons(reason),
		
	constraint fk_cancel_reason
		foreign key (cancel_reason)
		references lookup_cancel_reasons(reason),
		
	constraint fk_task_group_id
		foreign key (task_group_id)
		references group_details(group_id),
		
	constraint fk_task_importance
		foreign key (task_importance)
		references lookup_importance_divisions(importance),
		
	constraint fk_reference_task
		foreign key (workspace_id, reference_task)
		references task_details(workspace_id, task_number)
);

-- Contains all the subtask details for all tasks for all users and workspaces throughout the application.
create table sub_task_details (
	user_id int not null,
	workspace_id int not null,
	sub_task_number dt_task_number not null,
	task_number dt_task_number not null,
	sub_task_state dt_name not null,
	sub_task_name dt_task_name not null,
	sub_task_description dt_description null,
	assigned_to int not null,
	hold_status bool not null,
	hold_reason dt_name null,
	cancel_status bool not null,
	cancel_reason dt_name null,
	sub_task_group_id int not null,
	sub_task_importance dt_name not null,
	reference_task dt_task_number null,
	target_datetime timestamp with time zone not null,
	creation_datetime timestamp with time zone not null,
	completion_datetime timestamp with time zone null,
	last_comment dt_description null,
	
	primary key (workspace_id, sub_task_number),
	
	constraint fk_task_number
		foreign key (workspace_id, task_number)
		references task_details(workspace_id, task_number),
	
	constraint fk_workspace_id
		foreign key (workspace_id)
		references workspace_details(workspace_id),
		
	constraint fk_assigned_to
		foreign key (assigned_to)
		references user_details(user_id),
		
	constraint fk_hold_reason
		foreign key (hold_reason)
		references lookup_hold_reasons(reason),
		
	constraint fk_cancel_reason
		foreign key (cancel_reason)
		references lookup_cancel_reasons(reason),
		
	constraint fk_sub_task_group_id
		foreign key (sub_task_group_id)
		references group_details(group_id),
		
	constraint fk_sub_task_importance
		foreign key (sub_task_importance)
		references lookup_importance_divisions(importance),
		
	constraint fk_reference_task
		foreign key (workspace_id, reference_task)
		references sub_task_details(workspace_id, sub_task_number)
);

-- Contains the details of all the tasks/subtasks that are on hold due to other tasks for all users and workspaces throughout the application.
create table held_task_details (
	user_id int not null,
	workspace_id int not null,
	held_task_number dt_task_number not null,
	holding_task_number dt_task_number not null,
	held_reason dt_name not null,
	held_comments dt_description null,
	
	primary key (workspace_id, held_task_number),
	
	constraint fk_user_id
		foreign key (user_id)
		references user_details(user_id),
	
	constraint fk_held_task_number
		foreign key (workspace_id, held_task_number)
		references task_details(workspace_id, task_number),
	
	constraint fk_workspace_id
		foreign key (workspace_id)
		references workspace_details(workspace_id),
		
	constraint fk_held_reason
		foreign key (held_reason)
		references lookup_hold_reasons(reason)
);

-- Contains the audit of all the tasks for all users and workspaces throughout the application to display on each task. Subtask not included.
create table task_audit_details (
	user_id int not null,
	workspace_id int not null,
	task_number dt_task_number,
	task_action dt_name,
	task_state_new dt_name,
	task_state_old dt_name,
	task_group_id int,
	task_comment dt_description,
	hold_status bool,
	hold_reason dt_name,
	action_datetime timestamp with time zone,
	
	primary key (workspace_id, task_number),
	
	constraint fk_user_id
		foreign key (user_id)
		references user_details(user_id),
	
	constraint fk_workspace_id
		foreign key (workspace_id)
		references workspace_details(workspace_id)
);

-- Contains the audit of the subtasks alone for all users and workspaces throughout the application.
create table sub_task_audit_details (
	user_id int not null,
	workspace_id int not null,
	sub_task_number dt_task_number,
	task_number dt_task_number,
	sub_task_action dt_name,
	sub_task_state_new dt_name,
	sub_task_state_old dt_name,
	sub_task_group_id int,
	sub_task_comment dt_description,
	hold_status bool,
	hold_reason dt_name,
	action_datetime timestamp with time zone,
	
	primary key (workspace_id, sub_task_number),
	
	constraint fk_user_id
		foreign key (user_id)
		references user_details(user_id),
	
	constraint fk_workspace_id
		foreign key (workspace_id)
		references workspace_details(workspace_id)
);

create table filter_options (
	user_id int not null,
	workspace_id int not null,
	group_ids integer[],
	task_states text[],
	importance text[],
	has_sub_task text[],
	creation_datetime timestamp with time zone,
	creation_dt_operator varchar(10),
	target_datetime timestamp with time zone,
	target_dt_operator varchar(10),
	sorting_field varchar(100),
	sorting_order varchar(10),
	
	primary key (user_id, workspace_id),
	
	constraint fk_user_id
		foreign key (user_id)
		references user_details(user_id),
		
	constraint fk_workspace_id
		foreign key (workspace_id)
		references workspace_details(workspace_id)
);

-- Views

-- Contains the task details with the array of the subtask that it holds, workspace and group name
CREATE VIEW task_details_view AS
SELECT
    td.user_id,
    td.workspace_id,
    wd.workspace_name,
    td.task_group_id,
    gd.group_name,
    td.task_number,
    td.task_state,
    td.task_name,
    td.task_description,
    json_build_object(
    	'user_id', td.assigned_to,
    	'username', ud.username,
    	'name', concat(ud.first_name, ' ', ud.last_name)
    ) as assigned_to,
    wd.team_members,
    wd.admin_users,
    td.hold_status,
    td.hold_reason,
    td.cancel_status,
    td.cancel_reason,
    td.task_importance,
    td.reference_task,
    td.target_datetime,
    td.has_sub_task,
    td.sub_task_count,
    array_remove(array_agg(COALESCE(st.sub_task_number, 'placeholder')), 'placeholder') AS sub_task_numbers,
    CASE
        WHEN COUNT(st.*) = 0 THEN '{}'::json
        ELSE json_agg(json_build_object(
            'sub_task_number', COALESCE(st.sub_task_number, 'placeholder'),
            'sub_task_state', COALESCE(st.sub_task_state, 'placeholder')
        ) order by st.sub_task_number)
    END AS sub_task_details,
    td.creation_datetime,
    td.last_comment
FROM
    task_details td
INNER JOIN
    workspace_details wd
ON
    td.workspace_id = wd.workspace_id
INNER JOIN
    group_details gd
ON
    td.workspace_id = gd.workspace_id
    AND td.task_group_id = gd.group_id
LEFT JOIN
    sub_task_details st
ON
    td.workspace_id = st.workspace_id
    AND td.task_number = st.task_number
left join 
	user_details ud
on
	td.assigned_to = ud.user_id 
GROUP BY
    td.user_id,
    td.workspace_id,
    wd.workspace_name,
    gd.group_name,
    td.task_number,
    td.task_state,
    td.task_name,
    td.task_description,
    td.assigned_to,
    ud.username,
    ud.first_name,
    ud.last_name,
    wd.team_members,
    wd.admin_users,
    td.hold_status,
    td.hold_reason,
    td.cancel_status,
    td.cancel_reason,
    td.task_importance,
    td.reference_task,
    td.target_datetime,
    td.has_sub_task,
    td.creation_datetime,
    td.last_comment;
   
-- Contains the workspace details along with containing group details in JSON format
CREATE VIEW workspace_with_groups AS
SELECT 
    wd.creator_id,
    ud1.username as creator_username,
    concat(ud1.first_name, ' ', ud1.last_name) as creator_name,
    ud1.email_id as creator_email,
    wd.workspace_id,
    wd.workspace_name,
    wd.workspace_tagline,
    wd.workspace_description,
    (
    	select json_agg(json_build_object(
    		'user_id', ud_adm.user_id,
    		'username', ud_adm.username,
    		'email_id', ud_adm.email_id
    	) order by ud_adm.user_id)
    	from user_details ud_adm
    	where ud_adm.user_id = any(wd.admin_users)
    ) as admin_users,
    (
        SELECT json_agg(json_build_object(
            'user_id', ud.user_id,
            'username', ud.username,
            'email_id', ud.email_id
        ) ORDER BY ud.user_id)
        FROM user_details ud
        WHERE ud.user_id = ANY(wd.team_members)
    ) AS team_members,
    json_agg(json_build_object(
        'group_id', gd.group_id,
        'group_name', gd.group_name,
        'group_description', gd.group_description,
        'group_creation_datetime', gd.group_creation_datetime 
    ) ORDER BY gd.group_creation_datetime) AS groups,
    wd.workspace_creation_datetime
FROM
    workspace_details wd
LEFT JOIN (
    SELECT 
        user_id,
        workspace_id,
        group_id,
        group_name,
        group_description,
        group_creation_datetime
    FROM
        group_details
) gd
ON
    wd.creator_id = gd.user_id
    AND wd.workspace_id = gd.workspace_id
left join
	user_details ud1
on
	wd.creator_id = ud1.user_id 
GROUP BY
    wd.creator_id,
    ud1.user_id,
    wd.workspace_id,
    wd.workspace_name,
    wd.workspace_tagline,
    wd.workspace_description,
    wd.workspace_creation_datetime;
   

-- Invite View
CREATE VIEW all_invite_details AS
SELECT 
    id.invite_id,
    (
    	select json_build_object(
    		'user_id', ud1.user_id,
    		'name', concat(ud1.first_name, ' ', ud1.last_name),
    		'username', ud1.username,
    		'email_id', ud1.email_id
    	)
    	from user_details ud1
    	where ud1.user_id = id.requester_id
    ) as requester_details,
    (
    	select json_build_object(
    		'user_id', ud2.user_id,
    		'name', concat(ud2.first_name, ' ', ud2.last_name),
    		'username', ud2.username,
    		'email_id', ud2.email_id
    	)
    	from user_details ud2
    	where ud2.user_id = id.requestee_id
    ) as requestee_details,
    (
    	select json_build_object(
    		'workspace_id', wd.workspace_id,
    		'workspace_name', wd.workspace_name,
    		'creator_id', wd.creator_id,
    		'creator_name', (select first_name || ' ' || last_name from user_details ud3 where wd.creator_id=ud3.user_id)
    	)
    	from workspace_details wd
    	where wd.workspace_id = id.workspace_id
    ) as workspace_details,
    id.accept_status,
    id.reject_status,
    id.invite_datetime
FROM
    invite_details id;


-- Functions

CREATE OR REPLACE FUNCTION first_value(table_name text, column_name text)
RETURNS dt_name AS $$
DECLARE
    return_value dt_name;
BEGIN
    EXECUTE format('SELECT %I FROM %I LIMIT 1', column_name, table_name)
    INTO return_value;
    return return_value;
END;
$$ LANGUAGE plpgsql;
