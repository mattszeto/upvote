# yupvote
https://yupvote.net (try it out!)

social sharing, forums, and blog website using react / next.js / node / express / postgresql / graphql / redis / typeorm
- back-end deployed using dokku and docker
- front-end deployed using vercel

## CURRENTLY UNDER DEVELOPMENT

#### SERVER - How to properly set up dev environment:

1. open a terminal and type 'yarn watch'
   (this is so typescript is converted to javascript)
2. open another terminal and type 'yarn dev'
   (this watches the changes and outputs for you)

   ##### Setting up Postgresql DB (must have postgresql database server already installed):

   1. connect to PostgreSQL database server using psql
   2. create/enter in credentials
   3. add credentials to `server/src/index.ts` (optional to set-up a config.ts to store password)

   ##### Setting up Redis server (must have redis installed, using WSL on windows to run Redis server on a Ubuntu terminal)

   For Windows :

   1. open `Windows Terminal` and open a new Ubuntu tab
   2. run `sudo service redis-server start` to start redis server
   3. enter in password

   - should say `Starting redis-server: redis-server.`

   GraphQL server should run on http://localhost:4000/graphql

#### CLIENT - How to properly set up dev environment:

1. cd into client
2. `yarn dev`
3. http://localhost:3000
