import base_test

"""
Test for signing in as an admin
"""
class TestSignInAdmin(base_test.BaseTest):
  def test_sign_in_successful_admin(self):
    curr = self.driver.current_url
    self.assertEqual(curr, f'{self.BASE_URL}/admin/milestones')

  def role(self) -> base_test.Role:
    return base_test.Role.SUPER_ADMIN