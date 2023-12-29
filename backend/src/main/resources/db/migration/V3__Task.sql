CREATE TABLE task(
    id INT AUTO_INCREMENT PRIMARY KEY,
	name varchar(256),
	description TEXT,
    is_required BOOLEAN DEFAULT true,
    milestone_id INT,

    FOREIGN KEY (milestone_id) REFERENCES milestone(id)
);

INSERT INTO task (name, description, milestone_id)
VALUES
        ('Academic Advisor Meeting', 'Meet with academic advisor to discuss current major and class schedule', 1),
        ('Degreeworks', 'Complete Degreeworks Training', 1),

        ('Faculty Career Mentor Meeting', 'Meet with Faculty Career Mentor (Prof. Maureen Melville)', 2),

        ('Fill In Portfolio', 'List current Clubs, Organizations, and Athletic Programs in Career Readiness Dashboard (link to portfolio)', 3),

        ('Resume Draft Review', 'Meet with Compass to review your first resume draft', 4),
        ('Upload resume', 'Upload resume (link to portfolio)', 4),
        ('Create LinkedIn Profile', 'Create LinkedIn Profile (share URL here - link to section)', 4),


        ('Academic Advisor Meeting', 'Meet with academic advisor to discuss current major, possible minors, and class schedule', 5),

        ('Faculty Career Mentor Meeting', 'Meet with Faculty Career Mentor (Prof. Maureen Melville) to review Initial resume, LinkedIn development, interview basics', 6),
        ('Handshake and Indeed', 'Sign up for Handshake and Indeed', 6),
        ('Internships', 'Apply to 5 summer internships', 6),

        ('Draft Cover Letter', 'Upload draft cover letter (link to portfolio)', 7),

        ('Update Portfolio', 'Update current Clubs, Organizations, and Athletic Programs in Career Readiness Dashboard (link to portfolio)', 8),


        ('Academic Advisor Meeting', 'Meet with academic advisor to discuss class schedule and receive PIN for registration', 9),

        ('Faculty Career Mentor Meeting', 'Meet with Faculty Career Mentor (Prof. Maureen Melville) to update resume, all correspondence, and LinkedIn', 10),

        ('LinkedIn Photo', 'Upload professional headshot to LinkedIn', 11),
        ('Skills and Certs (1)', 'Skills and Certifications - (Choose LinkedIn Learning OR Technical Skill Development certification)', 11),
        ('Skills and Certs (2)', 'Skills and Certifications - (Choose LinkedIn Learning OR Technical Skill Development certification)', 11),

        ('Update Portfolio', 'Update current Clubs, Organizations, and Athletic Programs in Career Readiness Dashboard (link to portfolio)', 13),


        ('Senior Checklist', 'Fill out Senior Checklist (include link and instructions)', 13),
        ('Graduation Registration', 'Register for Graduation (include link and instructions)', 13),

        ('Faculty Career Mentor Meeting', 'Meet with Faculty Career Mentor (Prof. Maureen Melville) for interview prep', 14),

        ('Skills and Certs (3)', 'Skills and Certifications - (Choose LinkedIn Learning OR Technical Skill Development certification)', 15),
        ('Skills and Certs (4)', 'Skills and Certifications - (Choose LinkedIn Learning OR Technical Skill Development certification)', 15),

        ('Update Portfolio', 'Update current Clubs, Organizations, and Athletic Programs in Career Readiness Dashboard (link to portfolio)', 16);
