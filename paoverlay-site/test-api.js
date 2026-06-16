const https = require('https');

async function checkApi() {
  const data = JSON.stringify({ email: 'owaissayyed2007@gmail.com' });

  const options = {
    hostname: 'knowyourcandlelaunchsite.vercel.app',
    port: 443,
    path: '/api/verify-access',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  console.log('Sending POST to https://knowyourcandlelaunchsite.vercel.app/api/verify-access');

  const req = https.request(options, (res) => {
    console.log('Status Code:', res.statusCode);

    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('Response Body:', responseData);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.write(data);
  req.end();
}

checkApi();
