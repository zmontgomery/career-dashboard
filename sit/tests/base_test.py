import unittest
import yaml
import os
import time
from enum import Enum
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException

"""
Role enum for a user
"""
class Role(Enum):
  STUDENT = 1
  FACULTY = 2
  ADMIN = 3
  SUPER_ADMIN = 4

"""
Base container for the application
"""
APP_CONTAINER = 'app-container'

"""
Default timeout
"""
TIMEOUT = 5

"""
Base test that Integration tests should extend

Contains a setup function that loads the web driver, authenticates the user
if the test requires it, and navigates to the specified page

Contains a set of utility functions for interacting with elements on the page
"""
class BaseTest(unittest.TestCase):

  BASE_URL = "http://localhost:4200"

  """
  Creates the driver, signs in, and navigates to the page
  """
  def setUp(self):
    # Start selenium
    self.driver = webdriver.Chrome()
    self.driver.get(self.BASE_URL)

    # Wait until app is loaded
    self.findElementByClassName(APP_CONTAINER)

    # Sign in
    if (self.authenticated()):
      self.sign_in()

    # Navigate to page
    self.driver.get(f'{self.BASE_URL}/{self.path()}')
    self.findElementByClassName('logo-container')


  """
  Closes the web driver and clears existing authentication
  """
  def tearDown(self):
    # Clean up authentication
    self.driver.execute_script("window.localStorage.removeItem('authToken')")
    self.driver.execute_script("window.localStorage.removeItem('tokenIssue')")

    # Close the driver
    self.driver.close()

  """
  Signs in the test using the google sign in functionality
  """
  def sign_in(self):
    email, password = self._getRoleDetails()
    button = self.findElementByClassName('login-google-button')
    button.click()
    
    window_size = 1
    while window_size < 2:
      window_size = len(self.driver.window_handles)

    original_handle = self.driver.current_window_handle
    self.driver.switch_to.window(self.driver.window_handles[1])
    
    # Enter Username
    username = self.findElementById('identifierId')
    self.waitForElementToBeClickable(username)
    ActionChains(self.driver)\
      .click(username)\
      .send_keys(email)\
      .perform()
    
    # Go Next
    nextButton = self.findElementById('identifierNext')
    self.waitForElementToBeClickable(nextButton)
    ActionChains(self.driver)\
      .scroll_to_element(nextButton)\
      .click(nextButton)\
      .perform()
    
    # Enter Password
    passwordElem = self.findElementById('password')
    self.waitForElementToBeClickable(passwordElem)
    ActionChains(self.driver)\
      .click(passwordElem)\
      .send_keys(password)\
      .perform()
    
    # Submit
    nextButton = self.findElementById('passwordNext')
    self.waitForElementToBeClickable(nextButton)
    ActionChains(self.driver)\
      .scroll_to_element(nextButton)\
      .click(nextButton)\
      .perform()

    # Return to original window and wait until app is loaded
    self.driver.switch_to.window(original_handle)

    # Wait for the logout button to exist and be clickable
    try:
      return WebDriverWait(self.driver, 5).until(EC.element_to_be_clickable((By.CLASS_NAME, 'logout-button')))
    except TimeoutException:
      self.fail(f"Waiting for logout button failed")
    
  """
  Overwritable function for determining if the test should be authenticated

  Default is true
  """
  def authenticated(self) -> bool:
    return True
  
  """
  Overwritable function for determining if the test should be authenticated

  Default is ADMIN
  """
  def role(self) -> Role:
    return Role.ADMIN

  """
  Overwritable function for determining the page the test takes place on

  Default is '' 
  """
  # Overwrite in test method to 
  def path(self) -> str:
    return ''
  
  """
  Finds an element by its class name

  Times out after TIMEOUT seconds
  """
  def findElementByClassName(self, className):
    try:
      return WebDriverWait(self.driver, TIMEOUT).until(EC.presence_of_element_located((By.CLASS_NAME, className)))
    except TimeoutException:
      self.fail(f"Timeout on finding element with class name {className}")

  """
  Finds an element by its id

  Times out after TIMEOUT seconds
  """
  def findElementById(self, id):
    try:
      return WebDriverWait(self.driver, 5).until(EC.presence_of_element_located((By.ID, id)))
    except TimeoutException:
      self.fail(f"Timeout on finding element with id {id}")

  """
  Finds an element and waits for it to be clickable

  Times out after TIMEOUT seconds
  """
  def waitForElementToBeClickable(self, element):
    try:
      return WebDriverWait(self.driver, 5).until(EC.element_to_be_clickable(element))
    except TimeoutException:
      self.fail(f"Timeout on finding element with id {id}")

  """
  Loads the corresponding username and password from the "account_information.yml"
  file. By default this file does not exist and needs to be created per repository
  """
  def _getRoleDetails(self):
    dir_path = os.path.dirname(os.path.realpath(__file__))
    try:
      # Open account information file
      with open(f'{dir_path}/account_information.yml', 'r') as file:
        details = yaml.safe_load(file)
        email = ""
        password = ""
        role = self.role()

        # Get account information 
        if role == Role.STUDENT:
          email = details['student']['email']
          password = details['student']['password']
        elif role == Role.FACULTY:
          email = details['faculty']['email']
          password = details['faculty']['password']
        elif role == Role.ADMIN:
          email = details['admin']['email']
          password = details['admin']['password']

        # Return
        return email, password
    except FileNotFoundError:
      print("""\naccount_information.yml file was not found. 
            This is by design, as the email and passwords 
            for the corresponding accounts are not included
            in the git repository. copy the account_information_default.yml
            into an account_information.yml file and fill 
            out the fields with the email and password information
            in order to resolve this error\n"""
      ) 
      self.tearDown()
      self.skipTest('File not found')
    

if __name__ == "__main__":
  unittest.main()