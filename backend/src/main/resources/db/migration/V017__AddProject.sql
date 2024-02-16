SELECT @studentId := student_details_id FROM user WHERE user.id = @userId;

INSERT INTO project(id, student_details_id, name, description, start_date, end_date) 
VALUES (UUID_TO_BIN(UUID()), @studentId, 'fuzzer', 'built security testing application', '2024-01-20', '2024-02-16'),
    (UUID_TO_BIN(UUID()), @studentId, 'allergy-filter', 'make a database of meals with allergy filters', '2021-02-01', '2021-02-14');