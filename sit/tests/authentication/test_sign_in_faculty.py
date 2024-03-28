import base_test

"""
Test for signing in as a faculty
"""
class TestSignInFaculty(base_test.BaseTest):
  def test_sign_in_successful_faculty(self):
    curr = self.driver.current_url
    self.assertEqual(curr, f'{self.BASE_URL}/faculty/users')

  def role(self) -> base_test.Role:
    return base_test.Role.FACULTY