import base_test

"""
Test for if the app loads
"""
class TestAppLoads(base_test.BaseTest):
  def test_app_loads(self):
    self.findElementByClassName(base_test.APP_CONTAINER)

  def authenticated(self) -> bool:
    return False