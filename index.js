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

// DISPLAY REPO COUNT - RESPONSE
function setResponse(username, repos) {
  return `<h2>${username} has ${repos} GitHub repos :D</h2>`;
}

// FETCH REPO COUNT - REQUEST
async function getNumOfRepos(req, res, next) {
  try {
    console.log("Fetching Data...");
    // username is in the request payload
    const { username } = req.params;
    // make the request
    const response = await fetch(`https://api.github.com/users/${username}`);

    // format as JSON - we'll put the relevant data in our redis cache
    const data = await response.json();
    const repos = data.public_repos;

    // setex allows us to set a expiration; takes key, expiration in seconds, data to be cached
    client.setex(username, 3600, data);

    res.send(setResponse(username, repos));
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

app.listen(5000, () => {
  console.log(`App is now listening on port ${PORT}`);
});

// CACHE MIDDLEWARE

// when this route is hit, the function is executed
app.get("/repos/:username", getNumOfRepos);
