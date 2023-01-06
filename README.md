<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Description

This is the backend api for the Scrapping Google Search Results.This project is built by a progressive Node JS framework call [Nest](https://github.com/nestjs/nest).

## Tech Stack

The techstack for this project are as follow.

1. [Node JS v16](https://nodejs.org/en/blog/release/v16.16.0/)
2. [Postgres SQL](https://www.postgresql.org/) for storing data
3. [Redis](https://redis.io/docs/manual/cli/) for caching queue data
4. Typescript
5. [Bull](https://github.com/OptimalBits/bull) for web scarping the large amount of keyword by queue

## Installation

This project used package manager called `yarn`. To install the dependencies required for this project we need to run the following command.

```bash
$ yarn install
```

## Data Migration

Unfortunately, the prodject is not set up with database migration.\
But there is a dump file called `web-scrapper.sql`under `sample-data/` folder and can restore the sample data from it.

## Environment variable

To run the project, the environment variables are need. You can check the environment variables in `.env.sample`

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

For the testing, [Jest](https://jestjs.io/) is used to write some function and controllers and not perfect for all test cases because of time limit and difficulty in mocking some services.

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Demo

Demo application is hosted on Digital Ocean which is set up manually and run with [PM2](), not with docker.\
You can check the `Swagger Api Documentation` at [here](https://scrapper.evolvetechmm.co/v1/docs).\
The API documentations is set up with HTTP Basic Auth.\
The user name and password are `nimble` and `n1mbl3_2023!`

## License

Nest is [MIT licensed](LICENSE).
