const http = require('http');

function testAPI() {
  console.log('Testing API: GET /item/1');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/item/1',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response Body:', data);
      
      if (res.statusCode === 200) {
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ SUCCESS! Item 1 data:');
          console.log(`   ID: ${jsonData.id}`);
          console.log(`   Name: ${jsonData.name}`);
          console.log(`   Origin: ${jsonData.origin}`);
          console.log(`   Price: ${jsonData.price} wei`);
          console.log(`   Quality: ${jsonData.quality}`);
          console.log(`   State: ${jsonData.state}`);
          console.log(`   Farmer: ${jsonData.farmer}`);
        } catch (e) {
          console.log('❌ Failed to parse JSON:', e.message);
        }
      } else {
        console.log(`❌ FAILED with status: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Request error: ${e.message}`);
    console.log('Make sure the server is running on port 5000');
  });

  req.end();
}

testAPI();