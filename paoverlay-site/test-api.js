const https = require('https');

async function checkApi() {
  const url = 'https://www.knowyourcandle.com/api/verify-access?email=owaissayyed2007@gmail.com';
  
  console.log('Fetching', url);
  
  https.get(url, (res) => {
    console.log('Status Code:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response Body:', data);
    });
  }).on('error', (err) => {
    console.log('Error:', err.message);
  });
}

checkApi();
