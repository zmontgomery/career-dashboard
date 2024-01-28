CREATE TABLE student(
    studentID INT AUTO_INCREMENT PRIMARY KEY,
	userID BINARY(16),
	universityID DISTINCT VARCHAR(256),
    gpa DECIMAL(4, 3),
    description TEXT,
	graduationYear DATE,
	startDate DATE,
    degreeLevel VARCHAR(256),
	FOREIGN KEY (userID) REFERENCES user (userID)
);

CREATE TABLE coop(
    coopID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    coopName VARCHAR(256),
    location VARCHAR(256),
    description TEXT,
    startDate DATE,
    endDate DATE,
    FOREIGN KEY (studentID) REFERENCES student (studentID)
);

CREATE TABLE job(
    jobID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    jobName VARCHAR(256),
    location VARCHAR(256),
    description TEXT,
    startDate DATE,
    endDate DATE,
    FOREIGN KEY (studentID) REFERENCES student (studentID)
);

CREATE TABLE project(
    projectID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    projectName VARCHAR(256),
    description TEXT,
    startDate DATE,
    endDate DATE,
    FOREIGN KEY (studentID) REFERENCES student (studentID)
);

CREATE TABLE skill(
    skillID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    skillName VARCHAR(256),
    isLanguage BOOLEAN,
    FOREIGN KEY (studentID) REFERENCES student (studentID)
);

CREATE TABLE degreeProgram(
    programID INT AUTO_INCREMENT PRIMARY KEY,
    studentID INT,
    programName VARCHAR(256),
    isMinor BOOLEAN,
    FOREIGN KEY (studentID) REFERENCES student (studentID)
);

CREATE TABLE club(
    clubID INT AUTO_INCREMENT PRIMARY KEY,
    clubName VARCHAR(256),
    startDate DATE,
    endDate DATE,
    FOREIGN KEY (studentID) REFERENCES student (studentID)
)