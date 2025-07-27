require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const app = express();


const routes = require('./routes/routes');
app.use('/', routes);

const server = app.listen(8080, () => {
  console.log('서버 실행중 http://localhost:8080');
});

app.get('/', (req, res) => {
  res.send('docker watch, nodemon 테스트 / 아 성공 나이스 ㅋㅋㅋ');
});


process.on('SIGTERM', () => {
  server.close(() => {
    console.log('HTTP server closed')
  })
})
process.on('SIGINT', () => {
  server.close(() => {
    console.log('HTTP server closed')
  })
})
