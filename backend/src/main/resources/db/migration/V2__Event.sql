CREATE TABLE event(
    id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(256),
	description TEXT,
	date Date,
    is_required BOOLEAN DEFAULT true
);

INSERT INTO event (name, description, date)
VALUES  ('Major/Minor & Career Exploration Event', 'Explore careers', '2024-04-03'),
        ('Involvement Fair', 'get involved', '2024-04-03'),
        ('Major/Minor & Career Exploration Event', 'Explore careers', '2025-04-03'),
        ('Networking & Professionalism Workshop', '(online session)', '2025-04-03'),
        ('Attend Job Fair Fall Semester', 'Explore jobs', '2025-04-03'),
        ('Attend Job Fair Spring Semester', 'Explore jobs', '2025-04-03'),
        ('(Choose from list of School of Business Events) ', 'choose one', '2025-04-03'),
        ('(Choose from list of School of Business Events) ', 'choose one', '2025-04-03'),
        ('Attend Job Fair Fall Semester', 'Explore jobs', '2025-04-03'),
        ('Attend Job Fair Spring Semester', 'Explore jobs', '2025-04-03'),
        ('Attend Mock Interview Palooza', 'Practice interviews', '2025-04-03'),
        ('(Choose from list of School of Business Events) ', 'choose one', '2025-04-03'),
        ('(Choose from list of School of Business Events) ', 'choose one', '2025-04-03');
