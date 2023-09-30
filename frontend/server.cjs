const express = require('express');
const path = require('path');

const PROTOCOL = 'http';
const HOST = 'localhost';
const PORT = 4000;

const app = express();

app.use(express.static('dist/'));

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on ${PROTOCOL}://${HOST}:${PORT}`);
});
