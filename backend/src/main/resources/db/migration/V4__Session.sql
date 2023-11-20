CREATE TABLE session (
    id BINARY(16) PRIMARY KEY,
    email varchar(256) unique,
    sign_in_date timestamp,
    expiry_date timestamp,
    last_used timestamp
);

-- This will need to be updated to link to the user table when that exists