CREATE TABLE task(
    id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(256),
	description TEXT,
    is_required BOOLEAN
);

INSERT INTO task (name, description, is_required)
VALUES  ('Major/Minor & Career Exploration Event', '', true),
        ('Academic Advisor Meeting', 'Meet with academic advisor to discuss current major and class schedule', true),
        ('Degreeworks', 'Complete Degreeworks Training', true),
        ('Faculty Career Mentor Meeting', 'Meet with Faculty Career Mentor (Prof. Maureen Melville)', true),
        ('Fill In Portfolio', 'List current Clubs, Organizations, and Athletic Programs in Career Readiness Dashboard (link to portfolio)', true),
        ('Resume Draft Review', 'Meet with Compass to review your first resume draft', true),
        ('Upload resume', 'Upload resume (link to portfolio)', true),
        ('Create LinkedIn Profile', 'Create LinkedIn Profile (share URL here - link to section)', true),
        ('Academic Advisor Meeting', 'Meet with academic advisor to discuss current major, possible minors, and class schedule', true),
        ('Faculty Career Mentor Meeting', 'Meet with Faculty Career Mentor (Prof. Maureen Melville) to review Initial resume, LinkedIn development, interview basics', true),
        ('Handshake and Indeed', 'Sign up for Handshake and Indeed', true),
        ('Internships', 'Apply to 5 summer internships', true),
        ('Draft Cover Letter', 'Upload draft cover letter (link to portfolio)', true),
        ('Update Portfolio', 'Update current Clubs, Organizations, and Athletic Programs in Career Readiness Dashboard (link to portfolio)', true),
        ('Academic Advisor Meeting', 'Meet with academic advisor to discuss class schedule and receive PIN for registration', true),
        ('Faculty Career Mentor Meeting', 'Meet with Faculty Career Mentor (Prof. Maureen Melville) to update resume, all correspondence, and LinkedIn', true),
        ('LinkedIn Photo', 'Upload professional headshot to LinkedIn', true),
        ('Skills and Certs (1)', 'Skills and Certifications - (Choose LinkedIn Learning OR Technical Skill Development certification)', true),
        ('Skills and Certs (2)', 'Skills and Certifications - (Choose LinkedIn Learning OR Technical Skill Development certification)', true),
        ('Update Portfolio', 'Update current Clubs, Organizations, and Athletic Programs in Career Readiness Dashboard (link to portfolio)', true),
        ('Senior Checklist', 'Fill out Senior Checklist (include link and instructions)', true),
        ('Graduation Registration', 'Register for Graduation (include link and instructions)', true),
        ('Faculty Career Mentor Meeting', 'Meet with Faculty Career Mentor (Prof. Maureen Melville) for interview prep', true),
        ('Skills and Certs (3)', 'Skills and Certifications - (Choose LinkedIn Learning OR Technical Skill Development certification)', true),
        ('Skills and Certs (4)', 'Skills and Certifications - (Choose LinkedIn Learning OR Technical Skill Development certification)', true),
        ('Update Portfolio', 'Update current Clubs, Organizations, and Athletic Programs in Career Readiness Dashboard (link to portfolio)', true);
