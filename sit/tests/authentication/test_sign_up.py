import base_test
from selenium.webdriver.common.action_chains import ActionChains

CAN_EMAIL = 8
CAN_TEXT = 9
PHONE_NUMBER = 2
NICKNAME = 6

class TestSignUp(base_test.BaseTest):
  """
  Test for the sign up functionality
  """

  def setUp(self):
    self.email, _ = self._get_role_details()
    super().setUp()

  def test_sign_up(self):
    curr = self.driver.current_url
    self.assertEqual(curr, f'{self.BASE_URL}/signup')

    self.cursor.execute("SELECT * FROM user WHERE email=%s", (self.email,))
    user = self.cursor.fetchone()

    self.assertTrue(user[CAN_EMAIL])
    self.assertTrue(user[CAN_TEXT])
    self.assertEqual(user[PHONE_NUMBER], '111-111-1111')
    self.assertEqual(user[NICKNAME], 'CRD-Oswego')

    preferredNameField = self.find_element_by_class_name('nickname-field')
    self.wait_for_element_to_be_clickable(preferredNameField)
    ActionChains(self.driver)\
      .click(preferredNameField)\
      .send_keys("Nickname")\
      .perform()
    
    phoneNumberField = self.find_element_by_id('signup-pn')
    self.wait_for_element_to_be_clickable(phoneNumberField)
    ActionChains(self.driver)\
      .click(phoneNumberField)\
      .send_keys("aaa123dd456adsdsf7890212")\
      .perform()
    
    text = self.find_element_by_class_name('text-field')
    self.wait_for_element_to_be_clickable(text)
    ActionChains(self.driver)\
      .click(text)\
      .perform()
    
    email = self.find_element_by_class_name('email-field')
    self.wait_for_element_to_be_clickable(email)
    ActionChains(self.driver)\
      .click(email)\
      .perform()
    
    nextButton = self.find_element_by_class_name("next")
    self.wait_for_element_to_be_clickable(nextButton)
    ActionChains(self.driver)\
      .click(nextButton)\
      .perform()
    
    logout = self.find_element_by_class_name("logout-button")
    self.wait_for_element_to_be_clickable(logout)

    self.db.reset_session()
    self.cursor.execute("SELECT * FROM user WHERE email=%s", (self.email,))
    user = self.cursor.fetchone()

    self.assertFalse(user[CAN_EMAIL])
    self.assertFalse(user[CAN_TEXT])
    self.assertEqual(user[PHONE_NUMBER], '123-456-7890')
    self.assertEqual(user[NICKNAME], 'Nickname')


  def pre_test_sql_statements(self) -> list:
    return [f"UPDATE user SET signed_up=0 WHERE email='{self.email}'", "", "", "", "", ""]
  
  def post_test_sql_statements(self) -> list:
    return [f"UPDATE user SET signed_up=1 WHERE email='{self.email}'",
            f"UPDATE user SET can_text=1 WHERE email='{self.email}'",
            f"UPDATE user SET can_email=1 WHERE email='{self.email}'",
            f"UPDATE user SET phone_number='111-111-1111' WHERE email='{self.email}'",
            f"UPDATE user SET preferred_name='CRD-Oswego' WHERE email='{self.email}'",
            f"UPDATE user SET role='Faculty' WHERE email='{self.email}'"
          ]

  def authenticated(self) -> bool:
    return True
  
  def role(self) -> base_test.Role:
    return base_test.Role.FACULTY
