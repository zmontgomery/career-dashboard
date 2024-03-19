import base_test

"""
Test for signing in as a student
"""
class TestSignInStudent(base_test.BaseTest):
  def test_sign_in_successful_student(self):
    curr = self.driver.current_url
    self.assertEqual(curr, f'{self.BASE_URL}/dashboard')

  def role(self) -> base_test.Role:
    return base_test.Role.STUDENT