import base_test

class TestSignUp(base_test.BaseTest):
  def setUp(self):
    super().setUp()

  def test_sign_up_user_does_not_exist(self):
    pass
    
  def pre_test_sql_statements(self) -> list:
    return [
      "DELETE"
    ]
  
  def post_test_sql_statements(self) -> list:
    return [""]

  def authenticated(self) -> bool:
    return False
