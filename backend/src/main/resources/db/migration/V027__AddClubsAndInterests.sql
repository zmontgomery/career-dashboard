CREATE TABLE interest(
    id BINARY(16) PRIMARY KEY,
    student_details_id BINARY(16),
    name VARCHAR(256),
    FOREIGN KEY (student_details_id) REFERENCES student_details (id)
);

INSERT INTO interest(id, student_details_id, name) 
VALUES (UUID_TO_BIN(UUID()), @justinStudentId, 'Security'),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'Database Management', 0),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Project Management', 0),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Product Owner', 0),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Graphic Design', 0),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Software Development', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Full Stack Development', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Web Engineering', 0),
    (UUID_TO_BIN(UUID()), @studentId, 'Authentication', 0),
    (UUID_TO_BIN(UUID()), @studentId, 'Scrum Master', 0);


CREATE TABLE club(
    id BINARY(16) PRIMARY KEY,
    student_details_id BINARY(16),
    name VARCHAR(256),
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (student_details_id) REFERENCES student_details (id)
);

INSERT INTO club(id, student_details_id, name, start_date, end_date) 
VALUES (UUID_TO_BIN(UUID()), @justinStudentId, 'Jimmy Appreciation Club', '2023-09-20', '2024-05-13'),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'Hackathon', 0),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Society of Software Engineers', 0),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Women in Computing', 0),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Cards Club', 0),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Band', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Society of Software Engineers', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'National Society of Leadership and Success', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Board Game Night', '2022-10-20', '2023-04-30'),
    (UUID_TO_BIN(UUID()), @studentId, 'Jimmy Appreciation Club', 0),
    (UUID_TO_BIN(UUID()), @studentId, 'Band', '2023-09-20', '2024-05-13');

INSERT INTO skill(id, student_details_id, name, is_language) 
VALUES (UUID_TO_BIN(UUID()), @justinStudentId, 'Angular', 0),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'MySQL', 0),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'Java', 0),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Angular', 0),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'MySQL', 0),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Java', 0),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Angular', 0),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'MySQL', 0),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Java', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Angular', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'MySQL', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Java', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'React', 0),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'MongoDB', 0),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Python', 0);