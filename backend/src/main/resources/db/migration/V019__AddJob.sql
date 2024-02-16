INSERT INTO job(id, student_details_id, name, location, description, start_date, end_date, is_coop)
VALUES (UUID_TO_BIN(UUID()), @studentId, 'Software Engineer I', 'Rochester, NY', 'wrote automated tests', '2021-01-01', '2021-05-05', 0),
    (UUID_TO_BIN(UUID()), @studentId, 'Software Engineer I', 'Buffalo, NY', 'developed n environment dashboard', '2021-01-01', '2021-05-05', 1),
    (UUID_TO_BIN(UUID()), @studentId, 'Software Engineer I', 'Rochester, NY', 'wrote automated tests', '2021-01-01', '2021-05-05', 0);