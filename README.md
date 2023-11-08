# senior-project
Partially Hydrated devs - Senior Project

# Installation
- install jdk17 from https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- install node minimum versions v14.20, v16.14 or v18.10. https://nodejs.org/en/download
- install npm if it did not come with node
- install angular cli https://angular.io/guide/setup-local
- install mysql 8 from https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/
- navigate to the frontend/crd directory and run `npm install`

# Running the app
- open a terminal and navigate to the backend directory
- run `./gradlew bootrun`
- open another terminal and navigate to the frontend/crd directory
- run `npm start`
- open up your browser and go to http://localhost:4200/

# Notes
- the frontend will recompile automatically but the backend will not
- view API documentation at http://localhost:4200/swagger

# Executing tests
### Front-end
- `cd frontend/crd`
- `npm test`
- coverage found in frontend/crd/coverage/crd/index.html
### Back-end
- `cd backend`
- `./gradlew test`
- coverage found in backend/build/reports/jacoco/test/html/index.html