SET @justinStudentId = (SELECT student_details_id FROM user WHERE user.id = @justinUserId);
SET @brieStudentId = (SELECT student_details_id FROM user WHERE user.id = @brieUserId);
SET @johnStudentId = (SELECT student_details_id FROM user WHERE user.id = @johnUserId);
SET @rileyStudentId = (SELECT student_details_id FROM user WHERE user.id = @rileyUserId);

INSERT INTO project(id, student_details_id, name, description, start_date, end_date) 
VALUES (UUID_TO_BIN(UUID()), @justinStudentId, 'fuzzer', 'built security testing application', '2023-09-20', '2024-10-16'),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'PhD Candidate Search Engine and Database', 'make a job portal for people with a PhD', '2023-09-20', '2021-10-20'),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'fuzzer', 'built security testing application', '2024-01-20', '2024-02-16'),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'better bet', 'make a program designed to help people quit gambling addictions', '2022-03-14', '2022-08-29'),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'fuzzer', 'built security testing application', '2023-09-20', '2024-10-16'),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'webcheckers', 'made a web based version of checkers', '2021-01-01', '2021-05-14'),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'fuzzer', 'built security testing application', '2024-01-20', '2024-02-16'),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'allergy-filter', 'made a database of meals with allergy-based filters', '2021-02-01', '2021-02-14');

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

INSERT INTO job(id, student_details_id, name, location, description, start_date, end_date, is_coop)
VALUES (UUID_TO_BIN(UUID()), @justinStudentId, 'Software Engineer Intern', 'Rochester, NY', 'wrote automated tests', '2021-01-01', '2021-05-05', 1),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'Software Security Intern', 'Rochester, NY', 'made ennhancements to a job portal to make it more secure', '2021-01-01', '2021-05-05', 1),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'Tech Support', 'Boston, MA', 'fixed technical problems', '2017-08-21', '2018-03-16', 0),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'Software Engineer I', 'Rochester, NY', 'developed search engine', '2023-09-21', '2024-05-10', 0),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Electrician', 'Boston, MA', 'provided all computer systems with full power', '2021-01-01', '2021-05-05', 0),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Software Engineer I', 'Buffalo, NY', 'developed n environment dashboard', '2021-01-01', '2021-05-05', 1),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Software Engineer I', 'Rochester, NY', 'developed admin pages for a dashboard', '2023-09-20', '2024-05-10', 0),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Electrian', 'Rochester, NY', 'provided all computer systems with full power', '2019-02-02', '2020-01-28', 0),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Software Engineer I', 'Rochester, NY', 'developed a career readiness dashboard', '2023-09-20', '2024-05-10', 0),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Software Engineer Intern', 'Rochester, NY', 'worked on a webscraper on behalf of Google', '2022-05-20', '2022-10-10', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Software Engineer I', 'Rochester, NY', 'revamped a website', '2023-07-08', '2023-09-13', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Software Engineer I', 'Buffalo, NY', 'developed an environment dashboard', '2022-06-01', '2022-09-12', 1),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Software Engineer I', 'Rochester, NY', 'wrote automated tests', '2023-01-01', '2023-05-05', 0);

INSERT INTO degree_program(id, student_details_id, name, is_minor)
VALUES (UUID_TO_BIN(UUID()), @justinStudentId, 'Software Engineering', 0),
    (UUID_TO_BIN(UUID()), @justinStudentId, 'Cybersecurity', 1),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Software Engineering', 0),
    (UUID_TO_BIN(UUID()), @brieStudentId, 'Engineering', 1),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Software Engineering', 0),
    (UUID_TO_BIN(UUID()), @johnStudentId, 'Game Design', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Software Engineering', 0),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Web Development', 1),
    (UUID_TO_BIN(UUID()), @rileyStudentId, 'Communication', 1),
    (UUID_TO_BIN(UUID()), @studentId, 'Cybersecurity', 1);