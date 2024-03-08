ALTER TABLE user
ADD COLUMN signed_up BOOLEAN;

ALTER TABLE user
MODIFY COLUMN email VARCHAR(256) UNIQUE; 

UPDATE user
SET email = 'james@dbej.net'
WHERE email = 'james@dbej.net ';

UPDATE user
SET signed_up = 1;