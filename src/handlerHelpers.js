function handleError (res) {
  res.writeHead(404, { 'Content-type': 'text/html' });
  res.end('<h1>404 -- Page requested cannot be found</h1>');
}

function handleFile (res, data, ext) {
  res.writeHead(200, { 'Content-type': `text/${ext}` });
  res.end(data);
}

function getTweets (pool, res) {
  pool.query('SELECT users.username, tweets.tweets FROM users INNER JOIN tweets on(users.id=user_id);', (err, result) => {
    if (err) handleError (res);
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(result.rows));
  });
}

function postTweets (pool, res, req) {
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
}

function userAuthentication (username, password, pool, res) {
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
}

module.exports = {
  handleError: handleError,
  handleFile: handleFile,
  getTweets: getTweets,
  postTweets: postTweets,
  userAuthentication: userAuthentication
}
