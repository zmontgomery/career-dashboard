# senior-project
Partially Hydrated devs - Senior Project

# Setup

1. Git
   - Download git https://git-scm.com/downloads (recommended to install git bash on windows)
   - generate ssh key for github
     - install ssh if not already installed
     - from terminal run `ssh-keygen`
     - key should be in $home/.ssh/id_rsa unless you choose different location when generating
     - Go to Github -> Settings -> SS and GPG Keys -> New SSH Key
     - Copy $home/.ssh/id_rsa.pub into the key input
     - Give title and save

   - Clone the Repo
     - Go to Github and Code -> SSH -> copy
     - run `git clone git@github.com:bml2238/senior-project.git`
     - in a terminal
     - cd into senior-project
   - Setup git config
     - Open the command line.
     - Set your username: `git config --global user.name "FIRST_NAME LAST_NAME"`
     - Set your email address: `git config --global user.email "MY_NAME@example.com"`
   
2. Install jdk17
   - https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
   - (Optional) install JDKMAN for managing multiple jdk installations https://sdkman.io/. On Linux/Mac run 
   `curl -s "https://get.sdkman.io" | bash` you should be good to go. See jdkDocumentation for installing jdks. 
   On Windows you should be able to use it by simply install gitbash and following these instructions to get a 
   working `zip` https://stackoverflow.com/a/55749636
   
3. Install IDE of your choice. 
   - Recommend is IntelliJ Ultimate https://www.jetbrains.com/idea/. It comes with support for all the Backend and 
   Frontend Technologies. As a student you can get it for free. 
   - You can also Use VSCode and use install plugins for java/angular. 
   - If for whatever reason you can't get IntelliJ ultimate you can use the Community Version for the Backend and 
   VSCode for the frontend.
   
4. Install Node/NPM
   - minimum version v18.10. https://nodejs.org/en/download
   - install npm if it did not come with node
   - (Optional) install nvm (Node Version Manager) https://github.com/nvm-sh/nvm. 
   Works on Linux/Mac. It may work on Windows using GitBash, or there or some alternatives listed.
   
5. Install npm packages.
   - Go to senior-project/frontend/crd. run `npm install`. You will have to do this every time a dependency changes in 
   the frontend
   
6. Install mysql 8 from https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/
   - Create a database called CRD and a user called backend with all permissions to CRD
   - CLI example
     - run `mysql -u root -p` and use the password you set up when installing mysql
     - run (replace *password* with your password of choice)`CREATE USER 'backend'@'localhost' IDENTIFIED BY 'password';`
     - run `GRANT ALL PRIVILEGES ON CRD.* TO 'backend'@'localhost';`
     - run `quit`
     - run `mysql -u backend -p`
     - enter the password you just entered for the backend
     - run `CREATE DATABASE CRD;`

# Running the app
- Open a terminal and navigate to the backend directory
- This assumes a gmail is being used for the email notifications. If you wish to use a different gmail account use 
the environment variable EMAIL_USERNAME
- The super admin has the ability to edit the admin status of users, and is set as a build parameter at run time. 
You can set admin email to your email address to make yourself the super admin. 
<b> 
- Notes:
  - Make sure to use g.rit.edu if using rit email.
  - if you have not added your user to the database yet the backend may throw a non-fatal error on startup until you 
  either sign up and your user in the database or make a migration script to add yourself to the database
</b>
- your_password should be the backend users database password
- app password should be the app password for the gmail account that is sending emails. 
Recommended that the team makes one and shares it. You can create one later, just set app password to anything and 
the app still should build normally
- For further email and other configuration options see backend/src/main/resources/application.properties


- Add IDE configuration for running the app.
  - ### Backend
    - In IntelliJ go to Configuration -> Edit Configurations... -> Add new configuration -> Gradle
    - Name it 
    - select the backend directory as the gradle project
    - set the task to `bootrun`
    - in environment variables add `CRD_DB_PASSWORD=your_password; EMAIL_PASSWORD=app password; CRD_SUPER_ADMIN=admin email;`
  - ### Frontend
    - In IntelliJ go to Configuration -> Edit Configurations... -> Add new configuration -> npm
    - select `senior-project/frontend/crd/package.json` as the package.json
    - change the command to start
- Or 
  - run `export CRD_DB_PASSWORD=your_password; export EMAIL_PASSWORD=app password; export CRD_SUPER_ADMIN=admin email; ./gradlew bootrun`
  - Alternate Backend run
    - run `./setenv.sh` which will first ask you to setup the environment variables and then run the backend
  - Open another terminal and navigate to the frontend/crd directory
  - Run `npm start`
  

- Open up your browser and go to http://localhost:4200/

# Notes
- The frontend will recompile automatically but the backend will not
- View API documentation at http://localhost:4200/swagger
- You can add a compound command in IntelliJ that will run the backend/frontend together. 
You can also do this for frontend/backend test.

# Executing tests
### Front-end
- `cd frontend/crd`
- `npm run test-headless`
- coverage found in frontend/crd/coverage/crd/index.html
- for more accurate coverage, run `npm run test-headless-coverage`
### Back-end
- `cd backend`
- `./gradlew test`
- coverage found in backend/build/reports/jacoco/test/html/index.html
### Integration
- `cd sit`
- `./runner.sh`
- tests will take 

# Deploying
#### Work in Progress. This just showcases how to build angular app and run backend as jar that also serves angular app
- `cd frontend/crd`
- `npm run build`
- cd back to project home
- `cd backend`
- environment variables must be created or passed in when creating the jar
- `./gradlew build`
- jar is located at backend/build/libs/backend-X.X.X.jar
- use `java -jar backend-X.X.X.jar`

# Troubleshooting
- spring may not recognize changes in the db schema and will instead try to recreate tables that already exist
- if that happens, drop and recreate the db using the following commands (any data not in the migration scripts will be lost)
  - run `mysql -u backend -p`
  - enter the password for the backend
  - run `DROP DATABASE CRD;`
  - run `CREATE DATABASE CRD;`
