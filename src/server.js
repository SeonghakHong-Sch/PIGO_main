const express = require('express');
const app = express();

app.listen(8080, () => {
  console.log('서버 실행중 http://localhost:8080');
});

app.get('/', (req, res) => {
  res.send('안녕');
});
