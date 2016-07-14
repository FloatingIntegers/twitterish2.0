const fs = require('fs');
const Pool = require('pg').Pool;
const uri = require('url');
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/twitterish';
// const client = new pg.Client(connectionString);
const pool = new Pool({
  host: 'localhost',
  database: 'twitterish'
});
const { handleError, handleFile } = require('./handlerHelpers.js');

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
    console.log(queryurl);
    pool.query('SELECT id FROM users WHERE username = $1 AND password = $2;', ['bradley', 'pura'], (err, result) => {
      if (err) handleError(res);
      console.log(result);
      res.writeHead(200);
      res.end(JSON.stringify(result));
    });
    res.writeHead(200);
    res.end();
  } else if (url === '/getTweet') {
    pool.query('SELECT tweets FROM tweets;', (err, result) => {
      if (err) handleError (res);
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(JSON.stringify(result.rows));
    });
  } else if (url === '/postTweet') {
    let tweetText = '';
    req.on('data', (chunk) => {
      tweetText += chunk;
    });
    req.on('end', () => {
      pool.query('INSERT INTO tweets(user_id, tweets, timeid) values($1, $2, $3);', [1, tweetText, 'now()'], (err, result) => {
        if (err) handleError(res);
        res.writeHead(200);
        res.end();
      });
    });
  } else handleError(res);
}

module.exports = handler;
