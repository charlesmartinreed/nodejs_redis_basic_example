const express = require("express"),
  fetch = require("node-fetch"),
  redis = require("redis");

// PORT NUMBERS
const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;

// REDIS CLIENT
const client = redis.createClient(REDIS_PORT);

// INIT AND SETUP FOR EXPRESS
const app = express();

app.listen(5000, () => {
  console.log(`App is now listening on port ${PORT}`);
});
