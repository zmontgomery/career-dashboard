export HEADLESS=false

while getopts ht: flag
do
  case "${flag}" in
    h) export HEADLESS=true;;
    t) export TEST_NAME=${OPTARG};;
  esac
done

echo ===== INSTALLING DEPENDENCIES =====
pip3 install -r requirements.txt

echo ===== RUNNING TESTS =====
cd tests
python3 base_test.py