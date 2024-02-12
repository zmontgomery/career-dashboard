CREATE TABLE user (
    id BINARY(16) PRIMARY KEY,
    email VARCHAR(256),
    phone_number VARCHAR(256),
    last_login TIMESTAMP,
    date_created TIMESTAMP,
    first_name VARCHAR(256),
    preferred_name VARCHAR(256),
    last_name VARCHAR (256),
    can_email BOOLEAN,
    can_text BOOLEAN
);

INSERT INTO user(id, email, phone_number, first_name, preferred_name, last_name, can_email, can_text) 
VALUES (UUID_TO_BIN(UUID()), 'jrl9984@g.rit.edu', '717-809-1444', "James", "Jim", "Logan", 1, 1),
    (UUID_TO_BIN(UUID()), "jts7382@g.rit.edu", "111-111-1111", "Justin", "Justing", "Swistak", 1, 0),
    (UUID_TO_BIN(UUID()), "bml2238@g.rit.edu", "111-111-1111", "Brie", "Brie", "Lindberg", 1, 0),
    (UUID_TO_BIN(UUID()), "jld7456@g.rit.edu", "111-111-1111", "John", "John", "Davidson", 1, 0),
    (UUID_TO_BIN(UUID()), "rcb2957@g.rit.edu", "111-111-1111", "Riley", "Riley", "Brotz", 1, 0);