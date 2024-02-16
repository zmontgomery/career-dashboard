INSERT INTO student_details(id, university_id, gpa, description, graduation_year, start_date, year_level) 
VALUES (UUID_TO_BIN(UUID()), '2', 3.600, 'student', null, null, 'Senior'),
    (UUID_TO_BIN(UUID()), '3', 3.600, 'student', null, null, 'Senior'),
    (UUID_TO_BIN(UUID()), '4', 3.600, 'student', null, null, 'Senior'),
    (UUID_TO_BIN(UUID()), '5', 3.600, 'student', null, null, 'Senior');

SELECT @userId := id FROM user WHERE user.email="rcb2957@g.rit.edu";

UPDATE user
SET user.student_details_id = @id
WHERE user.id = @userId ;

UPDATE user
SET user.is_student = 1
WHERE user.id = @userId ;

UPDATE user
SET user.is_faculty = 1
WHERE user.id = @userId ;

UPDATE user
SET user.is_admin = 1
WHERE user.id = @userId ;

