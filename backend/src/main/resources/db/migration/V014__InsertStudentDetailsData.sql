SET @justinId = UUID_TO_BIN(UUID());
SET @brieId = UUID_TO_BIN(UUID());
SET @johnId = UUID_TO_BIN(UUID());
SET @rileyId = UUID_TO_BIN(UUID());

INSERT INTO student_details(id, university_id, gpa, description, graduation_year, start_date, year_level) 
VALUES (@justinId, '2', 3.600, 'student', null, null, 'Senior'),
    (@brieId, '3', 3.600, 'student', null, null, 'Senior'),
    (@johnId, '4', 3.600, 'student', null, null, 'Senior'),
    (@rileyId, '5', 3.600, 'student', null, null, 'Senior');

SET @userId = (SELECT id FROM user WHERE user.email="jrl9984@g.rit.edu");
SET @justinUserId = (SELECT id FROM user WHERE user.email="jts7382@g.rit.edu");
SET @brieUserId = (SELECT id FROM user WHERE user.email="bml2238@g.rit.edu");
SET @johnUserId = (SELECT id FROM user WHERE user.email="jld7456@g.rit.edu");
SET @rileyUserId = (SELECT id FROM user WHERE user.email="rcb2957@g.rit.edu");

UPDATE user
SET user.student_details_id = @id
WHERE user.id = @userId ;

UPDATE user
SET user.student_details_id = @justinId
WHERE user.id = @justinUserId ;

UPDATE user
SET user.student_details_id = @brieId
WHERE user.id = @brieUserId ;

UPDATE user
SET user.student_details_id = @johnId
WHERE user.id = @johnUserId ;

UPDATE user
SET user.student_details_id = @rileyId
WHERE user.id = @rileyUserId ;