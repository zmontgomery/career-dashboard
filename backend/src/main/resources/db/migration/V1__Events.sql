CREATE TABLE event(
    id LONG AUTO_INCREMENT PRIMARY KEY,
	name varchar(256),
	description TEXT,
	date Date,
    is_required BOOLEAN
);

INSERT INTO event (name, description, date, is_required)
VALUES  ('Major/Minor & Career Exploration Event', 'Explore careers', '2024-04-03', true),
        ('Involvement Fair', 'get involved', '2024-04-03', true),
        ('Major/Minor & Career Exploration Event', 'Explore careers', '2025-04-03', true),
        ('Networking & Professionalism Workshop', '(online session)', '2025-04-03', true),
        ('Attend Job Fair Fall Semester', 'Explore jobs', '2025-04-03', true),
        ('Attend Job Fair Spring Semester', 'Explore jobs', '2025-04-03', true),
        ('(Choose from list of School of Business Events) ', 'choose one', '2025-04-03', true),
        ('(Choose from list of School of Business Events) ', 'choose one', '2025-04-03', true),
        ('Attend Job Fair Fall Semester', 'Explore jobs', '2025-04-03', true),
        ('Attend Job Fair Spring Semester', 'Explore jobs', '2025-04-03', true),
        ('Attend Mock Interview Palooza', 'Practice interviews', '2025-04-03', true),
        ('(Choose from list of School of Business Events) ', 'choose one', '2025-04-03', true),
        ('(Choose from list of School of Business Events) ', 'choose one', '2025-04-03', true);
