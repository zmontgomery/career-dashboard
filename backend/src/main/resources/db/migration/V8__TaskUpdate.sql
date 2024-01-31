ALTER TABLE task ADD year_level ENUM('Freshman', 'Sophomore', 'Junior', 'Senior') AFTER milestone_id;

UPDATE
    task t,
    milestone m
SET
    t.year_level = m.year_level
WHERE
    t.milestone_id = m.id;