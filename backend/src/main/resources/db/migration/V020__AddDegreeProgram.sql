INSERT INTO degree_program(id, student_details_id, name, is_minor)
VALUES (UUID_TO_BIN(UUID()), @studentId, 'Software Engineering', 0),
    (UUID_TO_BIN(UUID()), @studentId, 'Computer Science', 0);