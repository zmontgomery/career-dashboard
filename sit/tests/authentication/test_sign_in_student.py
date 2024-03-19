import base_test

class TestSignInStudent(base_test.BaseTest):
  def test_sign_in_successful_student(self):
    curr = self.driver.current_url
    self.assertEqual(curr, f'{self.BASE_URL}/dashboard')