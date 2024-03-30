export HEADLESS=false

while getopts ht: flag
do
  case "${flag}" in
    h) export HEADLESS=true;;
    t) export TEST_NAME=${OPTARG};;
  esac
done

echo ===== CHECKING FOR ACCOUNT INFORMATION =====
FILE=./tests/account_information.yml
if test -f "$FILE"; then
 echo ===== ACCOUNT INFORMATION COMPLETE =====
else
  echo ===== ACCOUNT INFORMATION DOES NOT EXIST, PLEASE CREATE ACCOUNT INFORMATION FILE =====
  exit 1
fi;

echo ===== INSTALLING DEPENDENCIES =====
pip3 install -r requirements.txt

echo ===== RUNNING TESTS =====
cd tests
python3 base_test.py