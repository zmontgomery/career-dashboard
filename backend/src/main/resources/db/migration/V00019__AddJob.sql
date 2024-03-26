INSERT INTO job(id, student_details_id, name, location, description, start_date, end_date, is_coop)
VALUES (UUID_TO_BIN(UUID()), @studentId, 'Software Engineer I', 'Rochester, NY', 'developed an authentication service', '2024-09-20', '2024-05-10', 0),
    (UUID_TO_BIN(UUID()), @studentId, 'Software Engineer Intern', 'Philadelphia, PA', 'wrote automated tests', '2021-01-01', '2021-05-05', 1),
    (UUID_TO_BIN(UUID()), @studentId, 'Software Engineer II', 'Rochester, NY', 'developed a database for the IRS', '2022-01-01', '2021-05-05', 0);