CREATE TABLE milestone(
    id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(256),
	year_level ENUM('Freshman', 'Sophomore', 'Junior', 'Senior')
);

INSERT INTO milestone (name, year_level)
VALUES  ('Major Exploration', 'Freshman'),
        ('Career Mentorship', 'Freshman'),
        ('Campus Engagement', 'Freshman'),
        ('Professional Career Package Development', 'Freshman'),
        ('Major/Minor Exploration', 'Sophomore'),
        ('Career Mentorship', 'Sophomore'),
        ('Professional Career Package Development', 'Sophomore'),
        ('Campus Engagement', 'Sophomore'),
        ('Major/Minor Exploration', 'Junior'),
        ('Career Mentorship', 'Junior'),
        ('Professional Career Package Development', 'Junior'),
        ('Campus Engagement', 'Junior'),
        ('Job Preparation', 'Senior'),
        ('Career Mentorship', 'Senior'),
        ('Professional Career Package Development', 'Senior'),
        ('Campus Engagement', 'Senior');
