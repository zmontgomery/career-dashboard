# senior-project
Partially Hydrated devs - Senior Project

# Installation
- install jdk17 from https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- install node minimum versions v14.20, v16.14 or v18.10. https://nodejs.org/en/download
- install npm if it did not come with node
- install angular cli https://angular.io/guide/setup-local
- install mysql 8 from https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/
- create a database called CRD and a user called backend with all permissions to CRD
- CLI example
  - run `mysql -u root -p` and use the password you set up when installing mysql
  - run (replace *password* with your password of choice)`CREATE USER 'backend'@'localhost' IDENTIFIED BY 'password';`
  - run `quit`
  - run `mysql -u backend -p`
  - enter the password you just entered for the backend
  - run `CREATE DATABASE CRD;`
- navigate to the frontend/crd directory and run `npm install`

# Running the app
- open a terminal and navigate to the backend directory
- this assumes a gmail is being used for the email notifications. If you wish to use a different gmail account use 
- the environment variable EMAIL_USERNAME
- for further email and other configuration options see backend/src/main/resources/application.properties
- run `CRD_DB_PASSWORD={your_password} EMAIL_PASSWORD={app password} ./gradlew bootrun`
- or you can run `./setenv.sh` which will first ask you to setup the environment variables and then run the backend
- open another terminal and navigate to the frontend/crd directory
- run `npm start`
- open up your browser and go to http://localhost:4200/

# Notes
- the frontend will recompile automatically but the backend will not
- view API documentation at http://localhost:4200/swagger

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

# Deploying
- `cd frontend/crd`
- `npm run build`
- cd back to project home
- `cd backend`
- environment variables must be created or passed in when creating the jar
- `./gradlew build`
- jar is located at backend/build/libs/backend-X.X.X.jar

# Troubleshooting
- spring may not recognize changes in the db schema and will instead try to recreate tables that already exist
- if that happens, drop and recreate the db using the following commands (any data not in the migration scripts will be lost)
  - run `mysql -u backend -p`
  - enter the password for the backend
  - run `DROP DATABASE CRD;`
  - run `CREATE DATABASE CRD;`