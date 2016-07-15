const tape = require('tape');
const shot = require('shot');
const handlerHelpers = require('../src/handlerHelpers.js');
const handler = require('../src/handler.js');

tape('test get request to / works correctly', t => {
  shot.inject(handler, { method: 'get', url: '/' }, (res) => {
    t.equal(res.statusCode, 200, '/ has status code of 200');
    t.ok(res.payload.includes('<!DOCTYPE'), 'finds index html file');
    t.equal(res.headers['Content-type'], 'text/html', 'response type is html');
    t.end();
  });
});
