ALTER TABLE user
ADD COLUMN is_super_admin BOOLEAN;

UPDATE user
SET user.is_super_admin = 0;