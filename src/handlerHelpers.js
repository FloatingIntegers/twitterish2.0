function handleError (res) {
  res.writeHead(404, { 'Content-type': 'text/html' });
  res.end('<h1>404 -- Page requested cannot be found</h1>');
}

function handleFile (res, data, ext) {
  res.writeHead(200, { 'Content-type': `text/${ext}` });
  res.end(data);
}

module.exports = {
  handleError: handleError,
  handleFile: handleFile
}
