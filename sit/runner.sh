export HEADLESS=false

while getopts ht: flag
do
  case "${flag}" in
    h) export HEADLESS=true;;
    t) export TEST_NAME=${OPTARG};;
  esac
done

cd tests
python3 base_test.py