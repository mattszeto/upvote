# upvote

forums website using react / next.js / node / express / postgresql / graphql / redis

## CURRENTLY UNDER DEVELOPMENT

##### How to properly set up dev enviornment:

1. open a terminal and type 'yarn watch'
   (this is so typescript is converted to javascript)
2. open another terminal and type 'yarn dev'
   (this watches the changes and outputs for you)

   ##### Setting up Postgresql DB (must have postgresql database server already installed):

   1. connect to PostgreSQL database server using psql

   ##### Setting up Redis server (must have redis installed, using WSL on windows to run Redis server on a Ubuntu terminal)

   For Windows :

   1. open `Windows Terminal` and open a new Ubuntu tab
   2. run `sudo service redis-server start` to start redis server
   3. enter in password

   - should say `Starting redis-server: redis-server.`
