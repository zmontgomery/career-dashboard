SELECT @studentId := student_details_id FROM user WHERE user.id = @userId;

INSERT INTO project(id, student_details_id, name, description, start_date, end_date) 
VALUES (UUID_TO_BIN(UUID()), @studentId, 'fuzzer', 'built security testing application', '2023-09-20', '2024-10-16'),
    (UUID_TO_BIN(UUID()), @studentId, 'authentication', 'added login and logout features to a environment dashboard', '2021-02-01', '2021-02-14');