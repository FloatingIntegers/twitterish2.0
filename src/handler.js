const fs = require('fs');
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/twitterish';
const client = new pg.Client(connectionString);
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
  } else if (url === '/getTweet') {
    client.connect((err) => {
      if (err) handleError(res);

      client.query('SELECT tweets FROM tweets;', (err, result) => {
        if (err) handleError (res);

        console.log(rows.tweets);

        res.writeHead(200);

        res.end(rows.tweets);
      })
    })
  } else if (url === '/postTweet') {
    let tweetText = '';
    req.on('data', (chunk) => {
      tweetText += chunk;
    });
    req.on('end', () => {

      client.connect((err) => {
        if(err) handleError(res);

        client.query('INSERT INTO tweets(user_id, tweets, timeid) values($1, $2, $3);', [1, tweetText, 'now()'], (err, result) => {
          if (err) handleError(res);

          res.writeHead(200);
          res.end();
          // deleted client.end function fron here because we didnt seem to need it. Leaving a comment in case something breaks.
        });
      });
    });
  } else handleError(res);
}

module.exports = handler;
