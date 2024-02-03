-- Application: Todo App v1.0
-- Info: This script contains the queries to drop the tables.
-- Start Date: 12 August 2023
-- Author: Sushil Thakur (thesusheelthakur@gmail.com)

-- Drop the functions
DROP FUNCTION IF EXISTS first_value(text, text);

-- Drop views
drop view if exists task_details_view;
drop view if exists workspace_with_groups;
drop view if exists all_invite_details;

-- Drop the tables
drop table sub_task_audit_details;
drop table task_audit_details;
drop table held_task_details;
drop table sub_task_details;
drop table task_details;
drop table group_details;
drop table user_preference_details;
drop table invite_details;
drop table filter_options;
drop table workspace_details;
drop table email_verification_details;
drop table user_details;
drop table lookup_app_themes;
drop table lookup_cancel_reasons;
drop table lookup_task_actions;
drop table lookup_importance_divisions;
drop table lookup_hold_reasons;
drop table lookup_task_states;
drop table sessions;

-- Drop the domains
drop domain dt_task_name;
drop domain dt_task_number;
drop domain dt_name;
drop domain dt_short_description;
drop domain dt_description;
drop domain dt_json;

