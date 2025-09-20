// For Node.js < 18, we'll use a simpler approach without fetch
const http = require('http');

function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ text: () => data, ok: res.statusCode >= 200 && res.statusCode < 300 }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testAddFarmer() {
  try {
    const response = await makeRequest('http://localhost:5000/addfarmer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account: '0x5A565a20B879BCffdEfEF57d93f3c2A44fF2f176'
      })
    });
    
    const text = response.text();
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAddFarmer();
