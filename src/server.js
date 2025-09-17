require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const routes = require('./routes/routes');
const https =require('https');
const fs = require('fs');
const path = require('path')
const cors=require('cors');
const logMiddleware = require('./utils/middleWare.js');

const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../ssl/server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../ssl/server.crt'))
}

const app = express();
app.use(cors({
  origin: ['https://njihun.github.io', 'http://39.124.122.12', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(logMiddleware.logRequest);
app.use(express.json());
app.use('/', routes);


https.createServer(httpsOptions, app).listen(443, () => {
})

// const server = app.listen(8443, () => {
//   console.log('서버 실행중 http://localhost:8080');
// });

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
