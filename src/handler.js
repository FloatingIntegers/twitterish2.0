const fs = require('fs');
const Pool = require('pg').Pool;
const uri = require('url');
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  database: process.env.DB_NAME || 'twitterish',
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
});
const { handleError, handleFile, getTweets, postTweets, userAuthentication } = require('./handlerHelpers.js');

function handler(req, res) {
  const url = req.url;
  const ext = url.split('.')[1];
  if (url === '/') {
    fs.readFile(`${__dirname}/../public/index.html`, (err, data) => {
      if (err) handleError(res);
      else handleFile(res, data, 'html');
    });
  } else if (url.includes('public')) {
    fs.readFile(`${__dirname}/../${url}`, (err, data) => {
      if (err) handleError(res);
      else handleFile(res, data, ext);
    });
  } else if (url.includes('user')) {
    const queryurl = uri.parse(url).query.split('&');
    const username = queryurl[0].split('=')[1];
    const password = queryurl[1].split('=')[1];
    userAuthentication(username, password, pool, res);
  } else if (url === '/getTweet') {
    getTweets(pool, res);
  } else if (url === '/postTweet') {
    postTweets(pool, res, req);
  } else handleError(res);
}

module.exports = handler;
