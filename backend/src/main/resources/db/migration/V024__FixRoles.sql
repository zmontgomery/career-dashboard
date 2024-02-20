ALTER TABLE user
DROP COLUMN is_admin,
DROP COLUMN is_faculty,
DROP COLUMN is_student,
DROP COLUMN is_super_admin,
ADD COLUMN role ENUM('Student', 'Faculty', 'Admin', 'SuperAdmin');

UPDATE user
SET role = 'student';

UPDATE user
SET role = 'Admin'
WHERE   email = 'jrl9984@g.rit.edu' OR
        email = 'jts7382@g.rit.edu' OR
        email = 'bml2238@g.rit.edu' OR
        email = 'jld7456@g.rit.edu' OR
        email = 'rcb2957@g.rit.edu';

INSERT INTO user(id, email, phone_number, first_name, preferred_name, last_name, can_email, can_text, role)
    VALUE (UUID_TO_BIN(UUID()), 'justinswistak@gmail.com', '123-456-789', 'Justin', 'Justin', 'Faculty', 0, 0, 'Faculty');



