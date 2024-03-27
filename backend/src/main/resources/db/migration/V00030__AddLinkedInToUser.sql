ALTER TABLE user
ADD COLUMN linkedin VARCHAR(256);

UPDATE user
SET user.linkedin = "https://linkedin.com/profile=stduent"
WHERE user.id = @userId ;

UPDATE user
SET user.linkedin = "https://linkedin.com/profile=faculty"
WHERE user.id = @justinUserId ;

UPDATE user
SET user.linkedin = "https://linkedin.com/profile=sponsor-favorite"
WHERE user.id = @brieUserId ;

UPDATE user
SET user.linkedin = "https://linkedin.com/profile=3js"
WHERE user.id = @johnUserId ;

UPDATE user
SET user.linkedin = "https://linkedin.com/profile=user5"
WHERE user.id = @rileyUserId ;