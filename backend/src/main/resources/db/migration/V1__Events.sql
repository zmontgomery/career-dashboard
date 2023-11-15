CREATE TABLE event(
    eventID int,
	name varchar(256),
	description TEXT,
	eventDate Date,
	PRIMARY KEY (eventID)
);

INSERT INTO event (eventID, name, description, eventDate)
VALUES (8902394, 'Career Fair', 'Several companies visit campus', '03-03-2024');