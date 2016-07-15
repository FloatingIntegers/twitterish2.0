const fs = require('fs');
const Pool = require('pg').Pool;
const uri = require('url');
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/twitterish';
// const client = new pg.Client(connectionString);
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER, //env var: PGUSER
  database: process.env.DB_NAME || 'twitterish', //env var: PGDATABASE
  password: process.env.DB_PASSWORD, //env var: PGPASSWORD
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
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
    const username = queryurl[0].split('=')[1];
    const password = queryurl[1].split('=')[1];
    pool.query('SELECT id FROM users WHERE username = $1 AND password = $2;', [username, password], (err, result) => {
      if (err){
         handleError(res);
      } else if (result.rows[0] === undefined){
        pool.query('INSERT INTO users(username, password) values($1, $2)', [username, password], (err, result) => {
          pool.query('SELECT id FROM users WHERE username = $1 AND password = $2;', [username, password], (err, result) => {
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify(result.rows[0]));
          });
        });
      } else {
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(JSON.stringify(result.rows[0]));
      }
    });
  } else if (url === '/getTweet') {
    pool.query('SELECT users.username, tweets.tweets FROM users INNER JOIN tweets on(users.id=user_id);', (err, result) => {
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
        tweetText = JSON.parse(tweetText);
        const foreignKey = tweetText.cookie.split('=')[1];
          pool.query('INSERT INTO tweets(user_id, tweets, timeid) values($1, $2, $3);', [foreignKey, tweetText.text, 'now()'], (err, result) => {
            if (err) handleError(res);
            res.writeHead(200);
            res.end();
          })
      });


  } else handleError(res);
}

module.exports = handler;
