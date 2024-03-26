INSERT INTO skill(id, student_details_id, name, is_language) 
VALUES (UUID_TO_BIN(UUID()), @studentId, 'Angular', 0),
    (UUID_TO_BIN(UUID()), @studentId, 'MySQL', 0),
    (UUID_TO_BIN(UUID()), @studentId, 'Java', 0);