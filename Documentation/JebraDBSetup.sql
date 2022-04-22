USE [Jebra];

-- These tables are dropped so this script can be used to reset the database if necessary.
-- They are dropped in an order such that foreign key constraint errors are avoided.
DROP TABLE IF EXISTS [dbo].course_assignment;
DROP TABLE IF EXISTS [dbo].stage_event_join;
DROP TABLE IF EXISTS [dbo].course;
DROP TABLE IF EXISTS [dbo].statistic;
DROP TABLE IF EXISTS [dbo].instructor;
DROP TABLE IF EXISTS [dbo].app_user;
DROP TABLE IF EXISTS [dbo].stage_event;
DROP TABLE IF EXISTS [dbo].question;
DROP TABLE IF EXISTS [dbo].stage;
DROP TABLE IF EXISTS [dbo].subject;

CREATE TABLE [dbo].app_user (
	id					INT				NOT NULL	IDENTITY,
	email				VARCHAR(255)	NOT NULL,
	is_online			BIT				NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE [dbo].instructor (
	id					INT				NOT NULL	IDENTITY,
	fname				VARCHAR(50)		NOT NULL,
	lname				VARCHAR(50)		NOT NULL,
	username			VARCHAR(35)		NOT NULL,
	pass				VARCHAR(35)		NOT NULL,
	email				VARCHAR(255)	NOT NULL,
	PRIMARY KEY (id)
);
-- Sample instructor
INSERT INTO [dbo].instructor VALUES ('Al', 'Jebra', 'aj', 'jebraiscool123', 'aj@jebra.com');

CREATE TABLE [dbo].subject (
	id					INT				NOT NULL	IDENTITY,
	subject_name		VARCHAR(50)		NOT NULL,
	PRIMARY KEY (id)
);
-- Sample subjects
INSERT INTO [dbo].subject VALUES ('Simplify Exponents');
INSERT INTO [dbo].subject VALUES ('Simplify Exponents 2');
INSERT INTO [dbo].subject VALUES ('Simplify Square Roots');
INSERT INTO [dbo].subject VALUES ('Factorials');
INSERT INTO [dbo].subject VALUES ('Cartesian Coordinates');
INSERT INTO [dbo].subject VALUES ('Single Variable');
INSERT INTO [dbo].subject VALUES ('System Of Equations');
INSERT INTO [dbo].subject VALUES ('Quadratic Roots');
INSERT INTO [dbo].subject VALUES ('Trig Functions');
INSERT INTO [dbo].subject VALUES ('Inverse Trig Functions');

CREATE TABLE [dbo].stage (
	id					INT				NOT NULL	IDENTITY,
	max_hp				INT				NOT NULL,
	name				VARCHAR(50)		NOT NULL,
	subject_id			INT				NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (subject_id) REFERENCES [dbo].subject(id)
);
-- Sample stage
INSERT INTO [dbo].stage VALUES (100, 'Monster 1', 1);
INSERT INTO [dbo].stage VALUES (100, 'Monster 2', 2);
INSERT INTO [dbo].stage VALUES (100, 'Monster 3', 3);

CREATE TABLE [dbo].course (
	id					INT				NOT NULL	IDENTITY,
	cname				VARCHAR(30)		NOT NULL,
	code				INT,
	stage_id			INT,
	PRIMARY KEY (id),
	FOREIGN KEY (stage_id) REFERENCES [dbo].stage(id)
);
-- Sample course
INSERT INTO [dbo].course VALUES ('Algebra 1', 12345, 1);

CREATE TABLE [dbo].statistic (
	id					INT				NOT NULL	IDENTITY,
	score				FLOAT			NOT NULL,
	subject_id			INT				NOT NULL,
	user_id				INT				NOT NULL,
	correct_attempt		INT				NOT NULL,
	incorrect_attempt	INT				NOT NULL,
	game_date			DATE			NOT NULL,
	instructor_id		INT				NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES [dbo].app_user(id),
	FOREIGN KEY (subject_id) REFERENCES [dbo].subject(id),
	FOREIGN KEY (instructor_id) REFERENCES [dbo].instructor(id)
);

CREATE TABLE [dbo].course_assignment (
	id					INT				NOT NULL	IDENTITY,
	user_id				INT,
	instructor_id		INT				NOT NULL,
	course_id			INT				NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (user_id) REFERENCES [dbo].app_user(id),
	FOREIGN KEY (instructor_id) REFERENCES [dbo].instructor(id),
	FOREIGN KEY (course_id) REFERENCES [dbo].course(id) ON DELETE CASCADE
);
-- Assign sample instructor to sample course
INSERT INTO [dbo].course_assignment VALUES (NULL, 1, 1);

CREATE TABLE [dbo].question (
	id					INT				NOT NULL	IDENTITY,
	answer_a			VARCHAR(255)	NOT NULL,
	answer_b			VARCHAR(255),
	question			VARCHAR(255)	NOT NULL,
	subject_id			INT				NOT NULL,
	is_json				BIT				NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (subject_id) REFERENCES [dbo].subject(id)
);
-- Sample questions
INSERT INTO [dbo].question VALUES ('1', NULL, '$1^{2}$', 1, 0);
INSERT INTO [dbo].question VALUES ('4', NULL, '$2^{2}$', 1, 0);
INSERT INTO [dbo].question VALUES ('9', NULL, '$3^{2}$', 1, 0);
INSERT INTO [dbo].question VALUES ('16', NULL, '$4^{2}$', 1, 0);
INSERT INTO [dbo].question VALUES ('25', NULL, '$5^{2}$', 1, 0);
INSERT INTO [dbo].question VALUES ('36', NULL, '$6^{2}$', 1, 0);
INSERT INTO [dbo].question VALUES ('49', NULL, '$7^{2}$', 1, 0);
INSERT INTO [dbo].question VALUES ('64', NULL, '$8^{2}$', 1, 0);
INSERT INTO [dbo].question VALUES ('81', NULL, '$9^{2}$', 1, 0);
INSERT INTO [dbo].question VALUES ('100', NULL, '$10^{2}$', 1, 0);
INSERT INTO [dbo].question VALUES ('1', '-1', '$\sqrt{1}$', 3, 0);
INSERT INTO [dbo].question VALUES ('2', '-2', '$\sqrt{4}$', 3, 0);
INSERT INTO [dbo].question VALUES ('3', '-3', '$\sqrt{9}$', 3, 0);
INSERT INTO [dbo].question VALUES ('4', '-4', '$\sqrt{16}$', 3, 0);
INSERT INTO [dbo].question VALUES ('5', '-5', '$\sqrt{25}$', 3, 0);
INSERT INTO [dbo].question VALUES ('6', '-6', '$\sqrt{36}$', 3, 0);
INSERT INTO [dbo].question VALUES ('7', '-7', '$\sqrt{49}$', 3, 0);
INSERT INTO [dbo].question VALUES ('8', '-8', '$\sqrt{64}$', 3, 0);
INSERT INTO [dbo].question VALUES ('9', '-9', '$\sqrt{81}$', 3, 0);
INSERT INTO [dbo].question VALUES ('10', '-10', '$\sqrt{100}$', 3, 0);
INSERT INTO [dbo].question VALUES ('1', NULL, '$0!$', 4, 0);
INSERT INTO [dbo].question VALUES ('1', NULL, '$1!$', 4, 0);
INSERT INTO [dbo].question VALUES ('2', NULL, '$2!$', 4, 0);
INSERT INTO [dbo].question VALUES ('6', NULL, '$3!$', 4, 0);
INSERT INTO [dbo].question VALUES ('24', NULL, '$4!$', 4, 0);
INSERT INTO [dbo].question VALUES ('120', NULL, '$5!$', 4, 0);
INSERT INTO [dbo].question VALUES ('720', NULL, '$6!$', 4, 0);

CREATE TABLE [dbo].stage_event (
	id					INT				NOT NULL	IDENTITY,
	inflicted_hp		INT,
	was_correct			BIT				NOT NULL,
	event_time			DATETIME		NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE [dbo].stage_event_join (
	id					INT				NOT NULL	IDENTITY,
	stage_id			INT				NOT NULL,
	course_id			INT				NOT NULL,
	origin_user_id		INT				NOT NULL,
	question_id			INT				NOT NULL,
	stage_event_id		INT				NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT stage_id_fk_on_stage_event_join FOREIGN KEY (stage_id) REFERENCES [dbo].stage(id) ON DELETE CASCADE,
	CONSTRAINT course_id_fk_on_stage_event_join FOREIGN KEY (course_id) REFERENCES [dbo].course(id) ON DELETE CASCADE,
	CONSTRAINT user_id_fk_on_stage_event_join FOREIGN KEY (origin_user_id) REFERENCES [dbo].app_user(id),
	CONSTRAINT question_id_fk_on_stage_event_join FOREIGN KEY (question_id) REFERENCES [dbo].question(id),
	CONSTRAINT stage_event_id_fk_on_stage_event_join FOREIGN KEY (stage_event_id) REFERENCES [dbo].stage_event(id) ON DELETE CASCADE
);
