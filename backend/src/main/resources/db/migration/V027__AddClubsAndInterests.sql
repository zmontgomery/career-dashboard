CREATE TABLE interest(
    id BINARY(16) PRIMARY KEY,
    student_details_id BINARY(16),
    name VARCHAR(256),
    FOREIGN KEY (student_details_id) REFERENCES student_details (id)
);

INSERT INTO interest(id, student_details_id, name) 
VALUES (UUID_TO_BIN(UUID()), @justinStudentId, 'Security'),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'Database Management'),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Project Management'),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Product Owner'),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Graphic Design'),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Software Development'),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Full Stack Development'),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Web Engineering'),
    (UUID_TO_BIN(UUID()), @studentId, 'Authentication'),
    (UUID_TO_BIN(UUID()), @studentId, 'Scrum Master');


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
    (UUID_TO_BIN(UUID()), @justinStudentId, 'Hackathon', '2022-09-20', '2024-05-13'),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Society of Software Engineers', '2023-09-20', '2024-05-13'),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Women in Computing', '2022-10-13', '2024-05-05'),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Cards Club', '2023-02-16', '2023-03-13'),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Band', '2021-08-31', '2023-12-03'),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Society of Software Engineers', '2023-09-01', '2024-05-10'),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'National Society of Leadership and Success', '2022-11-20', '2024-03-10'),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Board Game Night', '2022-10-20', '2023-04-30'),
    (UUID_TO_BIN(UUID()), @studentId, 'Jimmy Appreciation Club', '2020-08-31', '2024-05-16'),
    (UUID_TO_BIN(UUID()), @studentId, 'Band', '2023-09-20', '2024-05-13');

INSERT INTO skill(id, student_details_id, name, is_language) 
VALUES (UUID_TO_BIN(UUID()), @justinStudentId, 'English', 1),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'Leet Speak', 1),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'Mandarin', 1),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'French', 1),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'English', 1),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'French', 1),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'English', 1),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Japanese', 1),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Spanish', 1),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'English', 1),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Spanish', 1),
    (UUID_TO_BIN(UUID()), @studentId, 'English', 1),
    (UUID_TO_BIN(UUID()), @studentId, 'Japanese', 1),
    (UUID_TO_BIN(UUID()), @studentId, 'Klingon', 1);