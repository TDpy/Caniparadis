# Caniparadis
Outil de gestion de prestations animales

## Setup
Using nvm, install node v22.17.0 ```nvm install v22.17.0``` or ```nvm use v22.17.0``` if version already installed

Then, run```npm i -g pnpm```

## Launch project

From project root:

- Install dependencies : ```pnpm i```
- Launch docker container (DB, mail, redis) : ```make up```
- Run front : ```pnpm dev:ui```
- Run back : ```pnpm dev:api```
