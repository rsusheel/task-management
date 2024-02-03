INSERT INTO workspace_details (user_id, workspace_id, workspace_name, workspace_tagline, workspace_description, workspace_icon)
VALUES
  (1000, 1, 'Workspace 1', 'Tagline 1', 'Description for Workspace 1', NULL),
  (1000, 2, 'Workspace 2', 'Tagline 2', 'Description for Workspace 2', NULL);

-- Insert test data for user_preference_details for user "sushi"
INSERT INTO user_preference_details (user_id, default_workspace_id, app_theme, app_perspective)
VALUES
  (1000, 1, 'Light', 'Perspective 1');

-- Insert test data for group_details for user "sushi"
INSERT INTO group_details (user_id, workspace_id, group_id, group_name, group_description)
VALUES
  (1000, 1, 1, 'Group 1', 'Description for Group 1'),
  (1000, 2, 2, 'Group 2', 'Description for Group 2');

-- Insert test data for task_details for user "sushi"
INSERT INTO task_details (user_id, workspace_id, task_number, task_state, task_name, task_description, hold_status, hold_reason, cancel_status, cancel_reason, task_group_id, task_importance, reference_task, target_date, has_sub_task, sub_task_count, last_comment)
VALUES
  (1000, 1, 'TASK0001', 'Created', 'Task 1', 'Description for Task 1', false, NULL, false, NULL, 1, 'Low', NULL, '2023-10-01', false, 0, NULL),
  (1000, 1, 'TASK0002', 'In Progress', 'Task 2', 'Description for Task 2', false, NULL, false, NULL, 2, 'Medium', NULL, '2023-10-15', true, 2, 'Comment for Task 2'),
  (1000, 2, 'TASK0003', 'Created', 'Task 3', 'Description for Task 3', false, NULL, false, NULL, 1, 'High', NULL, '2023-09-30', false, 0, NULL);

-- Insert test data for sub_task_details for user "sushi"
INSERT INTO sub_task_details (user_id, workspace_id, sub_task_number, task_number, sub_task_state, sub_task_name, sub_task_description, hold_status, hold_reason, sub_task_group_id, sub_task_importance, reference_task, target_date, last_comment)
VALUES
  (1000, 1, 'STASK0001', 'TASK0002', 'Created', 'Sub-Task 1', 'Description for Sub-Task 1', false, NULL, 1, 'Low', NULL, '2023-10-10', NULL),
  (1000, 1, 'STASK0002', 'TASK0002', 'In Progress', 'Sub-Task 2', 'Description for Sub-Task 2', false, NULL, 2, 'Medium', NULL, '2023-10-12', NULL),
  (1000, 2, 'STASK0003', 'TASK0003', 'Created', 'Sub-Task 3', 'Description for Sub-Task 3', false, NULL, 1, 'High', NULL, '2023-09-25', NULL);

-- Insert test data for task_audit_details for user "sushi"
INSERT INTO task_audit_details (user_id, workspace_id, task_number, task_action, task_state_new, task_state_old, task_group_id, task_comment, hold_status, hold_reason)
VALUES
  (1000, 1, 'TASK0001', 'Action 1', 'In Progress', 'Created', 1, 'Comment 1', false, NULL),
  (1000, 1, 'TASK0002', 'Action 2', 'On Hold', 'In Progress', 2, 'Comment 2', true, 'Delayed'),
  (1000, 2, 'TASK0003', 'Action 3', 'In Progress', 'Created', 1, 'Comment 3', false, NULL);

-- Insert test data for sub_task_audit_details for user "sushi"
INSERT INTO sub_task_audit_details (user_id, workspace_id, sub_task_number, task_number, sub_task_action, sub_task_state_new, sub_task_state_old, sub_task_group_id, sub_task_comment, hold_status, hold_reason)
VALUES
  (1000, 1, 'STASK0001', 'TASK0002', 'Action 1', 'In Progress', 'Created', 1, 'Comment 1', false, NULL),
  (1000, 1, 'STASK0002', 'TASK0002', 'Action 2', 'On Hold', 'In Progress', 2, 'Comment 2', true, 'Delayed'),
  (1000, 2, 'STASK0003', 'TASK0003', 'Action 3', 'In Progress', 'Created', 1, 'Comment 3', false, NULL);

-- Insert test data for held_task_details for user "sushi"
INSERT INTO held_task_details (user_id, workspace_id, held_task_number, holding_task_number, held_reason, held_comments)
VALUES
  (1000, 1, 'TASK0001', 'TASK0002', 'Dependent Task', 'Held due to dependency'),
  (1000, 2, 'TASK0002', 'TASK0003', 'Priority Task', 'Held for high-priority task');

-- Insert test data for workspace_details for user "sushi1"
INSERT INTO workspace_details (user_id, workspace_id, workspace_name, workspace_tagline, workspace_description, workspace_icon)
VALUES
  (1001, 1, 'Workspace 1', 'Tagline 1', 'Description for Workspace 1', NULL),
  (1001, 2, 'Workspace 2', 'Tagline 2', 'Description for Workspace 2', NULL);

-- Insert test data for user_preference_details for user "sushi1"
INSERT INTO user_preference_details (user_id, default_workspace_id, app_theme, app_perspective)
VALUES
  (1001, 1, 'Light', 'Perspective 1');

-- Insert test data for group_details for user "sushi1"
INSERT INTO group_details (user_id, workspace_id, group_id, group_name, group_description)
VALUES
  (1001, 1, 1, 'Group 1', 'Description for Group 1'),
  (1001, 2, 2, 'Group 2', 'Description for Group 2');

-- Insert test data for task_details for user "sushi1"
INSERT INTO task_details (user_id, workspace_id, task_number, task_state, task_name, task_description, hold_status, hold_reason, cancel_status, cancel_reason, task_group_id, task_importance, reference_task, target_date, has_sub_task, sub_task_count, last_comment)
VALUES
  (1001, 1, 'TASK0001', 'Created', 'Task 1', 'Description for Task 1', false, NULL, false, NULL, 1, 'Low', NULL, '2023-10-01', false, 0, NULL),
  (1001, 1, 'TASK0002', 'In Progress', 'Task 2', 'Description for Task 2', false, NULL, false, NULL, 2, 'Medium', NULL, '2023-10-15', true, 2, 'Comment for Task 2'),
  (1001, 2, 'TASK0003', 'Created', 'Task 3', 'Description for Task 3', false, NULL, false, NULL, 1, 'High', NULL, '2023-09-30', false, 0, NULL);

-- Insert test data for sub_task_details for user "sushi1"
INSERT INTO sub_task_details (user_id, workspace_id, sub_task_number, task_number, sub_task_state, sub_task_name, sub_task_description, hold_status, hold_reason, sub_task_group_id, sub_task_importance, reference_task, target_date, last_comment)
VALUES
  (1001, 1, 'STASK0001', 'TASK0002', 'Created', 'Sub-Task 1', 'Description for Sub-Task 1', false, NULL, 1, 'Low', NULL, '2023-10-10', NULL),
  (1001, 1, 'STASK0002', 'TASK0002', 'In Progress', 'Sub-Task 2', 'Description for Sub-Task 2', false, NULL, 2, 'Medium', NULL, '2023-10-12', NULL),
  (1001, 2, 'STASK0003', 'TASK0003', 'Created', 'Sub-Task 3', 'Description for Sub-Task 3', false, NULL, 1, 'High', NULL, '2023-09-25', NULL);

-- Insert test data for task_audit_details for user "sushi1"
INSERT INTO task_audit_details (user_id, workspace_id, task_number, task_action, task_state_new, task_state_old, task_group_id, task_comment, hold_status, hold_reason)
VALUES
  (1001, 1, 'TASK0001', 'Action 1', 'In Progress', 'Created', 1, 'Comment 1', false, NULL),
  (1001, 1, 'TASK0002', 'Action 2', 'On Hold', 'In Progress', 2, 'Comment 2', true, 'Delayed'),
  (1001, 2, 'TASK0003', 'Action 3', 'In Progress', 'Created', 1, 'Comment 3', false, NULL);

-- Insert test data for sub_task_audit_details for user "sushi1"
INSERT INTO sub_task_audit_details (user_id, workspace_id, sub_task_number, task_number, sub_task_action, sub_task_state_new, sub_task_state_old, sub_task_group_id, sub_task_comment, hold_status, hold_reason)
VALUES
  (1001, 1, 'STASK0001', 'TASK0002', 'Action 1', 'In Progress', 'Created', 1, 'Comment 1', false, NULL),
  (1001, 1, 'STASK0002', 'TASK0002', 'Action 2', 'On Hold', 'In Progress', 2, 'Comment 2', true, 'Delayed'),
  (1001, 2, 'STASK0003', 'TASK0003', 'Action 3', 'In Progress', 'Created', 1, 'Comment 3', false, NULL);

-- Insert test data for held_task_details for user "sushi1"
INSERT INTO held_task_details (user_id, workspace_id, held_task_number, holding_task_number, held_reason, held_comments)
VALUES
  (1001, 1, 'TASK0001', 'TASK0002', 'Dependent Task', 'Held due to dependency'),
  (1001, 2, 'TASK0002', 'TASK0003', 'Priority Task', 'Held for high-priority task');