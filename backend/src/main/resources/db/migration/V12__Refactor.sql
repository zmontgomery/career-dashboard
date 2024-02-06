ALTER TABLE milestone ADD description varchar(256);

ALTER TABLE task ADD task_type varchar(16);
ALTER TABLE task ADD artifact_name varchar(256);
ALTER TABLE task ADD event_id int;
ALTER TABLE task ADD FOREIGN KEY (event_id) REFERENCES event(id);

-- removes the "on delete cascade"
ALTER TABLE task DROP FOREIGN KEY task_ibfk_1;
ALTER TABLE task ADD FOREIGN KEY (milestone_id) REFERENCES milestone(id);

UPDATE task SET task_type = 'artifact';

ALTER TABLE event ADD organizer varchar(256);
ALTER TABLE event ADD location varchar(256);
ALTER TABLE event DROP COLUMN is_required;
ALTER TABLE event ADD is_recurring boolean;

UPDATE event SET organizer = 'SUNY Oswego';
UPDATE event SET location = 'SUNY Campus';
UPDATE event SET is_recurring = true;

ALTER TABLE artifact DROP COLUMN comment;