# Caniparadis

Web solution to manage customers, animals known, service types proposed and reservations of a company proposing petsitting, group walk, and others.

## Setup
Using nvm, install node v22.17.0 ```nvm install v22.17.0``` or ```nvm use ``` on project root.

Then, run```npm i -g pnpm```

## Launch project

From project root:

- Install dependencies : ```pnpm i```
- Launch docker container (DB, mail, redis) : ```make up```
- Run front : ```pnpm dev:ui```
- Run back : ```pnpm dev:api```


Once every docker started and both applications launched, access to UI at http://localhost:4200.
<br>
API swagger documentation can be accessed at http://localhost:3000/api.

## Error tracking

Sentry service is used, and will list every error on following environments : development, production.

## Deployment

Caniparadis project uses Render and Vercel services for deployment. A new release will be triggered into production when pushing/merging new code into "master" branch on Github.
