ALTER TABLE submission
ADD COLUMN artifact_id INT;

ALTER TABLE submission
ADD COLUMN student_id BINARY(16);

ALTER TABLE submission
ADD COLUMN task_id INT;

ALTER TABLE submission
DROP COLUMN submissionDate;

ALTER TABLE submission
ADD COLUMN submission_date TIMESTAMP;

ALTER TABLE submission
ADD CONSTRAINT FK_ARTIFACT_ID
FOREIGN KEY (artifact_id)
REFERENCES artifact (id);

ALTER TABLE submission
ADD CONSTRAINT FK_STUDENT_ID
FOREIGN KEY (student_id)
REFERENCES user (id);

ALTER TABLE submission
ADD CONSTRAINT FK_TASK_ID
FOREIGN KEY (task_id)
REFERENCES task (id);