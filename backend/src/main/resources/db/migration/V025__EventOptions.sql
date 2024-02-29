ALTER TABLE event
ADD COLUMN event_link varchar(256);

ALTER TABLE event
ADD COLUMN button_label varchar(256);

UPDATE event
SET event.button_label = "More Info";