-- Application: Todo App v1.0
-- Info: This script contains the queries to insert the values in the lookup tables.
-- Start Date: 6 August 2023
-- Author: Sushil Thakur (thesusheelthakur@gmail.com)


-- Inserting values in the lookup tables.

INSERT INTO lookup_task_states (state, description)
values
	('New', 'The new task. Not created yet.'),
    ('Created', 'The task has been created.'),
    ('In Progress', 'The task is in progress.'),
    ('On Hold', 'The task is on hold, can be due to various reasons.'),
    ('Completed', 'The task has been completed.'),
    ('Re-opened', 'The task has been re-opened after completion.'),
    ('Canceled', 'The task has been canceled.'),
    ('Closed', 'The case has been closed.');
    
INSERT INTO lookup_hold_reasons (reason, description)
VALUES
    ('Delayed', 'The task has been kept on hold as it is delayed.'),
    ('Dependent Task', 'The task has been kept on hold as it is dependent on other task.'),
    ('Priority Task', 'The task has been kept on hold as a task with high priority is being looked into.'),
    ('Other', 'The task has been kept on hold due to other reasons.');
    
INSERT INTO lookup_importance_divisions (importance, description)
VALUES
    ('Low', 'Low importance task.'),
    ('Medium', 'Medium importance task.'),
    ('High', 'High importance task.');
	
insert into lookup_cancel_reasons (reason, description)
values
	('Raised in error', 'The task was created in error.'),
	('Not relevant anymore', 'The task is not relevant anymore.'),
	('Task abandoned', 'The task has been abandoned.'),
	('Duplicate', 'The task has been duplicated from another task.'),
	('Other reason', 'The task has been canceled due to other reasons.');

insert into lookup_task_actions (task_action, description)
values
	('State updated', 'The task state has been updated.'),
	('Task held', 'The task state has been held.'),
	('Comment added','A comment has been added.'),
	('Task closed', 'The task has been closed.'),
	('Dependent case held', 'The task is holding another task.'),
	('Task re-opened', 'The task has been re-opened.'),
	('Task completed', 'The task has been completed.'),
	('Task canceled', 'The task has been canceled.'),
	('Sub-task created', 'A sub-task has been created for this task.'),
	('Sub-task updated', 'A sub-task has been updated.'),
	('Sub-task completed', 'A sub-task has been completed.'),
	('Sub-task canceled', 'A sub-task has been canceled.');

insert into lookup_app_themes (theme_name, theme_colors_json)
values
	('Light', 'temp'),
	('Dark', 'temp');


-- Set default values for table columns by altering it

alter table user_preference_details 
alter column app_theme
set default 'Light';

alter table task_details
alter column task_importance
set default 'Low';

alter table sub_task_details
alter column sub_task_importance
set default 'Low';

alter table held_task_details
alter column held_reason
set default 'Delayed';
	
