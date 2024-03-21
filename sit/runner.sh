export HEADLESS=false

while getopts ht: flag
do
  case "${flag}" in
    h) export HEADLESS=true;;
    t) export TEST_NAME=${OPTARG};;
  esac
done

echo $HEADLESS
echo $TEST_NAME

cd tests
python3 base_test.py