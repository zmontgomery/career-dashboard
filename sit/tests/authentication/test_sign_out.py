import base_test
from selenium.webdriver.common.action_chains import ActionChains

"""
Test for signing in as an admin
"""
class TestSignOut(base_test.BaseTest):
  def test_sign_out(self):
    # Perform sign out
    self.click_element('user-button')
    self.click_element('mat-mdc-menu-item')
    self.find_element_by_class_name(base_test.APP_CONTAINER)

    # Assert on proper page
    curr = self.driver.current_url
    self.assertEqual(curr, f'{self.BASE_URL}/login')
