const http = require('http');

function testHarvestEndpoint() {
  console.log('🌾 Testing Harvest Endpoint (POST /harvest)');
  console.log('=============================================');
  
  // Use the same parameters as in your UI
  const harvestData = {
    name: 'apple',
    origin: 'delhi',
    price: 1500,
    quality: 'Premium',
    account: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'  // Account 2
  };
  
  const postData = JSON.stringify(harvestData);
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/harvest',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('Request data:', harvestData);
  
  const req = http.request(options, (res) => {
    console.log(`\nResponse Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response Body:', data);
      
      if (res.statusCode === 200) {
        console.log('✅ SUCCESS! Harvest completed through server endpoint');
        
        // Wait a moment then test if the item was created
        setTimeout(() => {
          console.log('\n🔍 Testing if new item was created...');
          testItemCreated();
        }, 2000);
        
      } else {
        console.log('❌ FAILED! Server returned error');
        
        // This might give us insight into why the UI is failing
        if (data.includes('revert')) {
          console.log('🔍 EVM revert error detected - same as UI!');
          console.log('   This confirms the issue is in the harvest logic');
        }
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Request error: ${e.message}`);
    console.log('Make sure the server is running on port 5000');
  });

  req.write(postData);
  req.end();
}

function testItemCreated() {
  // Check current item counter
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/item/1',  // Test any existing item first
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Server is responding to item requests');
        
        // Now check for item 3 (should be the new apple)
        checkNewItem();
      } else {
        console.log('❌ Server item endpoint not working');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Item check error: ${e.message}`);
  });

  req.end();
}

function checkNewItem() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/item/3',  // Should be the new apple
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Item 3 created successfully!');
        try {
          const item = JSON.parse(data);
          console.log(`   🍎 Name: ${item.name}`);
          console.log(`   🍎 Origin: ${item.origin}`);
          console.log(`   🍎 Quality: ${item.quality}`);
          console.log(`   🍎 Farmer: ${item.farmer}`);
        } catch (e) {
          console.log('Raw response:', data);
        }
      } else {
        console.log(`❌ Item 3 not found (status: ${res.statusCode})`);
        console.log('   This means the harvest did not create a new item');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ New item check error: ${e.message}`);
  });

  req.end();
}

testHarvestEndpoint();