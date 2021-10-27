USE [Jebra];

-- These tables are dropped so this script can be used to reset the database if necessary.
-- They are dropped in an order such that foreign key constraint errors are avoided.
DROP TABLE IF EXISTS [dbo].course_assignment;
DROP TABLE IF EXISTS [dbo].stage_event_join;
DROP TABLE IF EXISTS [dbo].statistic_join;
DROP TABLE IF EXISTS [dbo].course;
DROP TABLE IF EXISTS [dbo].instructor;
DROP TABLE IF EXISTS [dbo].app_user;
DROP TABLE IF EXISTS [dbo].statistic;
DROP TABLE IF EXISTS [dbo].stage_event;
DROP TABLE IF EXISTS [dbo].question;
DROP TABLE IF EXISTS [dbo].stage;
DROP TABLE IF EXISTS [dbo].subject;

CREATE TABLE [dbo].app_user (
	id					INT				NOT NULL,
	email				VARCHAR(255)	NOT NULL,
	is_online			CHAR(5)			NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE [dbo].instructor (
	id					INT				NOT NULL,
	fname				VARCHAR(50)		NOT NULL,
	lname				VARCHAR(50)		NOT NULL,
	username			VARCHAR(35)		NOT NULL,
	pass				VARCHAR(35)		NOT NULL,
	email				VARCHAR(255)	NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE [dbo].statistic (
	id					INT				NOT NULL,
	first_time_correct	INT,
	total_retries		INT,
	score				FLOAT,
	PRIMARY KEY (id)
);

CREATE TABLE [dbo].subject (
	id					INT				NOT NULL,
	subject_name		VARCHAR(50)		NOT NULL,
	PRIMARY KEY (id)
);
-- Sample subjects
INSERT INTO [dbo].subject VALUES (1, 'Simplify Exponents');
INSERT INTO [dbo].subject VALUES (2, 'Simplify Square Roots');
INSERT INTO [dbo].subject VALUES (3, 'Factorials');

CREATE TABLE [dbo].stage (
	id					INT				NOT NULL,
	max_hp				INT				NOT NULL,
	name				VARCHAR(50)		NOT NULL,
	subject_id			INT				NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (subject_id) REFERENCES [dbo].subject(id)
);

CREATE TABLE [dbo].course (
	id					INT				NOT NULL,
	cname				VARCHAR(30)		NOT NULL,
	code				VARCHAR(9),
	stage_id			INT,
	PRIMARY KEY (id),
	FOREIGN KEY (stage_id) REFERENCES [dbo].stage(id)
);

CREATE TABLE [dbo].course_assignment (
	id					INT				NOT NULL,
	user_id				INT,
	instructor_id		INT				NOT NULL,
	course_id			INT				NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES [dbo].app_user(id),
	FOREIGN KEY (instructor_id) REFERENCES [dbo].instructor(id),
	FOREIGN KEY (course_id) REFERENCES [dbo].course(id)
);

CREATE TABLE [dbo].statistic_join (
	id					INT				NOT NULL,
	user_id				INT				NOT NULL,
	course_id			INT				NOT NULL,
	stage_id			INT				NOT NULL,
	statistic_id		INT				NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES [dbo].app_user(id),
	FOREIGN KEY (course_id) REFERENCES [dbo].course(id),
	FOREIGN KEY (stage_id) REFERENCES [dbo].stage(id),
	FOREIGN KEY (statistic_id) REFERENCES [dbo].statistic(id)
);

CREATE TABLE [dbo].question (
	id					INT				NOT NULL,
	answer_a			VARCHAR(255)	NOT NULL,
	answer_b			VARCHAR(255),
	question			VARCHAR(255)	NOT NULL,
	subject_id			INT				NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (subject_id) REFERENCES [dbo].subject(id)
);
-- Sample questions
INSERT INTO [dbo].question VALUES (1, '1', NULL, '1^2', 1);
INSERT INTO [dbo].question VALUES (2, '4', NULL, '2^2', 1);
INSERT INTO [dbo].question VALUES (3, '9', NULL, '3^2', 1);
INSERT INTO [dbo].question VALUES (4, '16', NULL, '4^2', 1);
INSERT INTO [dbo].question VALUES (5, '25', NULL, '5^2', 1);
INSERT INTO [dbo].question VALUES (6, '36', NULL, '6^2', 1);
INSERT INTO [dbo].question VALUES (7, '49', NULL, '7^2', 1);
INSERT INTO [dbo].question VALUES (8, '64', NULL, '8^2', 1);
INSERT INTO [dbo].question VALUES (9, '81', NULL, '9^2', 1);
INSERT INTO [dbo].question VALUES (10, '100', NULL, '10^2', 1);
INSERT INTO [dbo].question VALUES (11, '1', '-1', 'sqrt(1)', 2);
INSERT INTO [dbo].question VALUES (12, '2', '-2', 'sqrt(4)', 2);
INSERT INTO [dbo].question VALUES (13, '3', '-3', 'sqrt(9)', 2);
INSERT INTO [dbo].question VALUES (14, '4', '-4', 'sqrt(16)', 2);
INSERT INTO [dbo].question VALUES (15, '5', '-5', 'sqrt(25)', 2);
INSERT INTO [dbo].question VALUES (16, '6', '-6', 'sqrt(36)', 2);
INSERT INTO [dbo].question VALUES (17, '7', '-7', 'sqrt(49)', 2);
INSERT INTO [dbo].question VALUES (18, '8', '-8', 'sqrt(64)', 2);
INSERT INTO [dbo].question VALUES (19, '9', '-9', 'sqrt(81)', 2);
INSERT INTO [dbo].question VALUES (20, '10', '-10', 'sqrt(100)', 2);
INSERT INTO [dbo].question VALUES (21, '1', NULL, '0!', 3);
INSERT INTO [dbo].question VALUES (22, '1', NULL, '1!', 3);
INSERT INTO [dbo].question VALUES (23, '2', NULL, '2!', 3);
INSERT INTO [dbo].question VALUES (24, '6', NULL, '3!', 3);
INSERT INTO [dbo].question VALUES (25, '24', NULL, '4!', 3);
INSERT INTO [dbo].question VALUES (26, '120', NULL, '5!', 3);
INSERT INTO [dbo].question VALUES (27, '720', NULL, '6!', 3);

CREATE TABLE [dbo].stage_event (
	id					INT				NOT NULL,
	inflicted_hp		INT,
	was_correct			CHAR(5)			NOT NULL,
	event_time			DATETIME		NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE [dbo].stage_event_join (
	id					INT				NOT NULL,
	stage_id			INT				NOT NULL,
	course_id			INT				NOT NULL,
	origin_user_id		INT				NOT NULL,
	question_id			INT				NOT NULL,
	stage_event_id		INT				NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (stage_id) REFERENCES [dbo].stage(id),
	FOREIGN KEY (course_id) REFERENCES [dbo].course(id),
	FOREIGN KEY (origin_user_id) REFERENCES [dbo].app_user(id),
	FOREIGN KEY (question_id) REFERENCES [dbo].question(id),
	FOREIGN KEY (stage_event_id) REFERENCES [dbo].stage_event(id)
);