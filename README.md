## HOW TO RUN THIS PROJECT
1. Make sure your NodeJS is installed properly
2. Clone this project and enter directory
3. Install Redis
4. Run this command "npm i" in your command line/terminal to install the depedencies
5. Configure database in config/config.js
6. Run "npx sequelize-cli db:migrate" to migrating the latest database schema (if it doesn't work run "sequelize-cli db:migrate")
7. Rename .env.example to .env and rewrite the variables
8. Run "npx sequelize-cli db:seed:all" for initial insert data to users table

## ENVIRONMENT CONFIGURATION
Use this command pattern to run this project npm start *port* *environment*  
ex: npm start 3001 development  
nb: if the port and environment aren't defined, then default values are in .env file

## OPTIONAL DEPEDENCIES
Optional depedency for synchronous database schema to models file  
1. Install MySQL dialect for NodeJS globally, run in terminal 'npm i -g mysql'  
2. Install Sequelize-Auto, run in terminal 'npm i -g sequelize-auto'  
3. Run in terminal "npm run sync-models" everytime you migrate sequelize