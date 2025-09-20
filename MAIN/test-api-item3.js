const http = require('http');

function testAPIItem3() {
  console.log('Testing API: GET /item/3');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/item/3',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response Body:', data);
      
      if (res.statusCode === 200) {
        try {
          const jsonData = JSON.parse(data);
          console.log('✅ Item 3 response received:');
          console.log(`   ID: ${jsonData.id}`);
          console.log(`   Name: "${jsonData.name}"`);
          console.log(`   Origin: "${jsonData.origin}"`);
          console.log(`   Price: ${jsonData.price} wei`);
          console.log(`   Quality: "${jsonData.quality}"`);
          console.log(`   State: ${jsonData.state}`);
          console.log(`   Farmer: ${jsonData.farmer}`);
          
          // Check for empty/null values
          if (!jsonData.name || jsonData.name === '') {
            console.log('⚠️  WARNING: Name is empty');
          }
          if (!jsonData.origin || jsonData.origin === '') {
            console.log('⚠️  WARNING: Origin is empty');
          }
          if (jsonData.farmer === '0x0000000000000000000000000000000000000000') {
            console.log('⚠️  WARNING: Farmer is zero address - item might not exist');
          }
        } catch (e) {
          console.log('❌ Failed to parse JSON:', e.message);
        }
      } else if (res.statusCode === 404) {
        console.log('✅ Item 3 does not exist (404 - which is correct)');
      } else {
        console.log(`❌ FAILED with status: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Request error: ${e.message}`);
  });

  req.end();
}

testAPIItem3();