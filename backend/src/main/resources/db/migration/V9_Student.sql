CREATE TABLE Student(
    studentID varchar,
	userID varchar,
	universityID distinct varchar,
	graduationYear Date,
	startDate Date,
	PRIMARY KEY (studentID),
	FOREIGN KEY (userID) REFERENCES User (userID)
);

CREATE TABLE Coop(
    coopID varchar,
    studentID varchar,
    description varchar,
    startDate Date,
    endDate Date,
    PRIMARY KEY (coopID),
    FOREIGN KEY (studentID) REFERENCES Student (studentID)
);

CREATE TABLE Job(
    jobID varchar,
    studentID varchar,
    description varchar,
    startDate Date,
    endDate Date,
    PRIMARY KEY (jobID),
    FOREIGN KEY (studentID) REFERENCES Student (studentID)
);