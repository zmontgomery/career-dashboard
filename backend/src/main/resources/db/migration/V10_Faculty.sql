CREATE TABLE faculty(
    facultyID INT AUTO_INCREMENT PRIMARY KEY,
    userID BINARY(16),
    isAdmin BOOLEAN,
    FOREIGN KEY (userID) REFERENCES User (userID)
);