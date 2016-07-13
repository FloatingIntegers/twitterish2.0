const http = require('http');
const handler = require('./handler.js');
const { handleError, handleFile } = require('./handlerHelpers.js');
const port = 4000;

http.createServer(handler).listen(port);

console.log(`server is running on ${port}`);
