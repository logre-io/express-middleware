# Logre.IO Express Middleware
Express middleware to send logs to [Logre.IO](https://logre.io).

[![Twitter Follow](https://img.shields.io/twitter/follow/logreio.svg?style=social)](https://twitter.com/logreio)

## Installation
```bash
$ npm install logreio-express
# or
$ yarn add logreio-express
```

## Usage
```javascript
import createLogger from "logreio-express";
import express from "express";

const app = express();
const logger = createLogger({
  id: '266544239593512423',
  key: '******'
})

app.use(logger);
```