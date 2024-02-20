ALTER TABLE task
ADD COLUMN submission_instructions VARCHAR(1024);

ALTER TABLE task
DROP COLUMN task_type;

ALTER TABLE task
ADD COLUMN task_type ENUM("COMMENT", "ARTIFACT", "EVENT");

UPDATE task
SET task_type = "COMMENT";

UPDATE task
SET task_type = "ARTIFACT"
WHERE id = 6 OR id = 12;

UPDATE task
SET submission_instructions = "Leave a comment stating you attended the meeting";

UPDATE task
SET submission_instructions = "Upload a pdf of your resume"
WHERE id = 6;

UPDATE task
SET submission_instructions = "Create a linkedin profile and paste the URL in the comments section"
WHERE id = 7;

UPDATE task
SET submission_instructions = "Upload a pdf of your draft cover letter"
WHERE id = 12;

UPDATE task
SET submission_instructions = "Apply for graduation and include the link in the comments section"
WHERE id = 21;