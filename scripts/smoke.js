const http = require('http');

const url = process.env.SMOKE_URL || 'http://localhost:3000';

const req = http.get(url, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  if (res.statusCode === 200) process.exit(0);
  else process.exit(2);
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
  process.exit(1);
});
