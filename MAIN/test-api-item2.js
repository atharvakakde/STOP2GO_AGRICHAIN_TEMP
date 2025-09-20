const http = require('http');

function testAPIItem2() {
  console.log('Testing API: GET /item/2 (Your Mango)');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/item/2',
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
          console.log('✅ SUCCESS! Your Mango (Item 2) data:');
          console.log(`   🥭 ID: ${jsonData.id}`);
          console.log(`   🥭 Name: ${jsonData.name}`);
          console.log(`   🥭 Origin: ${jsonData.origin}`);
          console.log(`   🥭 Price: ${jsonData.price} wei`);
          console.log(`   🥭 Quality: ${jsonData.quality}`);
          console.log(`   🥭 State: ${jsonData.state}`);
          console.log(`   🥭 Farmer: ${jsonData.farmer}`);
          
          if (jsonData.farmer === '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0') {
            console.log('✅ Confirmed: This was harvested by Account 2!');
          }
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

testAPIItem2();