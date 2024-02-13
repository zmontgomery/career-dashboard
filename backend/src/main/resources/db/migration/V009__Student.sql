CREATE TABLE student_details (
    id BINARY(16) PRIMARY KEY,
	university_id VARCHAR(256),
    gpa DECIMAL(4, 3),
    description VARCHAR(256),
	graduation_year TIMESTAMP,
	start_date TIMESTAMP,
    degree_level VARCHAR(256)
);

-- CREATE TABLE job(
--     jobID INT AUTO_INCREMENT PRIMARY KEY,
--     studentID INT,
--     jobName VARCHAR(256),
--     location VARCHAR(256),
--     description TEXT,
--     startDate DATE,
--     endDate DATE,
--     isCoop BOOLEAN,
--     FOREIGN KEY (studentID) REFERENCES student (studentID)
-- );

-- CREATE TABLE project(
--     projectID INT AUTO_INCREMENT PRIMARY KEY,
--     studentID INT,
--     projectName VARCHAR(256),
--     description TEXT,
--     startDate DATE,
--     endDate DATE,
--     FOREIGN KEY (studentID) REFERENCES student (studentID)
-- );

-- CREATE TABLE skill(
--     skillID INT AUTO_INCREMENT PRIMARY KEY,
--     studentID INT,
--     skillName VARCHAR(256),
--     isLanguage BOOLEAN,
--     FOREIGN KEY (studentID) REFERENCES student (studentID)
-- );

-- CREATE TABLE degreeProgram(
--     programID INT AUTO_INCREMENT PRIMARY KEY,
--     studentID INT,
--     programName VARCHAR(256),
--     isMinor BOOLEAN,
--     FOREIGN KEY (studentID) REFERENCES student (studentID)
-- );

-- CREATE TABLE club(
--     clubID INT AUTO_INCREMENT PRIMARY KEY,
--     studentID INT,
--     clubName VARCHAR(256),
--     startDate DATE,
--     endDate DATE,
--     FOREIGN KEY (studentID) REFERENCES student (studentID)
-- );