# Assign the output of the command to a variable after removing "total"
total_lines=$(git ls-files | grep -E '\.(java|less|html|ts|sql)$' | xargs wc -l | grep total | sed 's/total//')

# Print the variable
echo "Total lines of code for Java, Less, HTML, SQL, and TypeScript files: $total_lines"
