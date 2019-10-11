## HOW TO RUN THIS PROJECT
# 1. Run this command "npm i" in your command line/terminal
# 2. Install redis
# 3. Run "npx sequelize-cli db:migrate" to migrating the latest database schema (if it doesn't work run "sequelize-cli db:migrate")
# 4. Rename .env.example to .env and rewrite the variables
# 5. Run "npx sequelize-cli db:seed:all" for initial insert data to users table

## ENVIRONMENT CONFIGURATION
# Use this command pattern to run this project npm start *port* *environment*
ex: npm start 3001 development
nb: if the port and environment aren't defined, then default values are 3000 and development