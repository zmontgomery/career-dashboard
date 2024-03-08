CREATE TABLE student_details (
    id BINARY(16) PRIMARY KEY,
	university_id VARCHAR(256),
    gpa DECIMAL(4, 3),
    description VARCHAR(256),
	graduation_year TIMESTAMP,
	start_date TIMESTAMP,
    year_level ENUM('Freshman', 'Sophomore', 'Junior', 'Senior')
);

CREATE TABLE job(
    id BINARY(16) PRIMARY KEY,
    student_details_id BINARY(16),
    name VARCHAR(256),
    location VARCHAR(256),
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_coop BOOLEAN,
    FOREIGN KEY (student_details_id) REFERENCES student_details (id)
);

CREATE TABLE project(
    id BINARY(16) PRIMARY KEY,
    student_details_id BINARY(16),
    name VARCHAR(256),
    description TEXT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (student_details_id) REFERENCES student_details (id)
);

CREATE TABLE skill(
    id BINARY(16) PRIMARY KEY,
    student_details_id BINARY(16),
    name VARCHAR(256),
    is_language BOOLEAN,
    FOREIGN KEY (student_details_id) REFERENCES student_details (id)
);

CREATE TABLE degree_program(
    id BINARY(16) PRIMARY KEY,
    student_details_id BINARY(16),
    name VARCHAR(256),
    is_minor BOOLEAN,
    FOREIGN KEY (student_details_id) REFERENCES student_details (id)
);