INSERT INTO user(id, email, phone_number, first_name, preferred_name, last_name, can_email, can_text, signed_up, role) 
  VALUES (UUID_TO_BIN(UUID()), 'crdoswegostudent@gmail.com', '111-111-1111', "CRD-Oswego", "CRD-Oswego", "Student", 1, 1, 1, 'Student'),
  (UUID_TO_BIN(UUID()), 'crdoswegofaculty@gmail.com', '111-111-1111', "CRD-Oswego", "CRD-Oswego", "Faculty", 1, 1, 1, 'Faculty'),
  (UUID_TO_BIN(UUID()), 'crdoswegoadm1n@gmail.com', '111-111-1111', "CRD-Oswego", "CRD-Oswego", "Admin", 1, 1, 1, 'Admin')