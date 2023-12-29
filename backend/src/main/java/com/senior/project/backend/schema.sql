CREATE DATABASE CareerReadiness;
USE CareerReadiness;

CREATE TABLE Department(
    departmentID int,
	name varchar,
	PRIMARY KEY(departmentID)
)

CREATE TABLE Major(
	majorID int,
	name varchar,
	abbreviation varchar,
	departmentID int,
	PRIMARY KEY (majorID),
	FOREIGN KEY (departmentID) REFERENCES Department (departmentID)
)

CREATE TABLE User(
    userID varchar,
	email varchar,
	phoneNumber varchar
	dateCreated Date,
	lastLogin Date,
	firstName varchar,
	lastName varchar,
	canEmail bool,
	canText bool,
	PRIMARY KEY (userId)
);

CREATE TABLE Faculty(
    facultyID varchar,
	userID varchar,
	isAdmin bool,
	PRIMARY KEY (facultyID)
	FOREIGN KEY (userID) REFERENCES User (userID)
)

CREATE TABLE Student(
    studentID varchar,
	userID varchar,
	universityID distinct varchar,
	graduationYear Date,
	startDate Date,
	PRIMARY KEY (studentID),
	FOREIGN KEY (userID) REFERENCES User (userID)
)

CREATE TABLE Activity(
    activityID int,
	description varchar,
	needsArtifact bool,
	date Date,
	PRIMARY KEY (activityID)
)

CREATE TABLE Milestone(
    milestoneID int,
	activityID distinct int,
	isActive bool,
	PRIMARY KEY (milestoneID),
	FOREIGN KEY (activityID) REFERENCES Activity (activityID)
)


CREATE TABLE Event(
    eventID int,
	name varchar,
	description varchar,
	isRecurring bool,
	organizer varchar,
	location varchar,
	isRequired bool,
	eventDate Date,
	PRIMARY KEY (eventID),
	FOREIGN KEY (activityID) REFERENCES Activity (activityID)
)

CREATE TABLE Artifact(
    artifactID int,
	name varchar,
	fileLocation varchar
	comment varchar,
	PRIMARY KEY (artifactID)
)

CREATE TABLE Assignment(
    assignmentID varchar,
	studentID varchar,
	activityID int,
	PRIMARY KEY (assignmentID),
	FOREIGN KEY  (studentID) REFERENCES Student (studentID),
	FOREIGN KEY (activityID) REFERENCES Activity (activityID)
)

CREATE TABLE Submission(
    submissionID varchar,
	assignmentID varchar,
	artifactID int,
	submissionDate Date,
	PRIMARY KEY (submissionID),
	FOREIGN KEY (assignmentID) REFERENCES Assignment (assignmentID),
	FOREIGN KEY (artifactID) REFERENCES Artifact (artifactID)
)

-- Defect Density in file: 47 defects/0.100KLOC before corrections made

INSERT INTO Event (eventID, name, description, isRecurring, organizer, location, isRequired, eventDate)
VALUES (8902394, 'Career Fair', 'Several companies visit campus', True, 'SUNY Oswego', 'SAU', True, '03-03-2024');