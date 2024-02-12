ALTER TABLE user
ADD COLUMN student_details_id BINARY(16) REFERENCES student_details (id);

ALTER TABLE user
ADD COLUMN is_admin BOOLEAN;

ALTER TABLE user
ADD COLUMN is_faculty BOOLEAN;

ALTER TABLE user
ADD COLUMN is_student BOOLEAN;

SET @id = UUID_TO_BIN(UUID());

INSERT INTO student_details(id, university_id, gpa, description, graduation_year, start_date, degree_level) 
VALUES (@id, 1, 3.5, "a stduent", null, null, "Senior");

UPDATE user
SET user.student_details_id = @id
LIMIT 1;

UPDATE user
SET user.is_student = 0;

UPDATE user
SET user.is_student = 1
LIMIT 1;

UPDATE user
SET user.is_faculty = 1;

Update user
SET user.is_admin = 1;