const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

app.use(express.static('clientfiles'));
app.get('/', (req, result) => {
  result.sendFile(path.join(__dirname, 'clientfiles', 'main.html'));
});
 app.listen(port, () => {
});