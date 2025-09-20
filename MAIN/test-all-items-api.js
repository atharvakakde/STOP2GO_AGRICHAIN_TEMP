const http = require('http');

function testAllItemsAPI() {
  console.log('📦 Testing /items API endpoint');
  console.log('==============================');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/items',
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
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(data);
          console.log(`\n✅ SUCCESS! Found ${response.totalItems} total items`);
          console.log(`📊 Showing ${response.items.length} valid items:\n`);
          
          response.items.forEach((item, index) => {
            console.log(`📦 ITEM ${item.id}:`);
            console.log(`   🍎 Name: ${item.name}`);
            console.log(`   📍 Origin: ${item.origin}`);
            console.log(`   💰 Price: ${item.price} wei`);
            console.log(`   ⭐ Quality: ${item.quality}`);
            console.log(`   📊 State: ${item.state} (${getStateName(item.state)})`);
            console.log(`   👨‍🌾 Farmer: ${item.farmer}`);
            
            if (item.distributor !== '0x0000000000000000000000000000000000000000') {
              console.log(`   🚛 Distributor: ${item.distributor}`);
            }
            if (item.retailer !== '0x0000000000000000000000000000000000000000') {
              console.log(`   🏪 Retailer: ${item.retailer}`);  
            }
            if (item.consumer !== '0x0000000000000000000000000000000000000000') {
              console.log(`   👥 Consumer: ${item.consumer}`);
            }
            
            console.log(''); // Empty line between items
          });
          
        } catch (e) {
          console.log('❌ Failed to parse JSON:', e.message);
          console.log('Raw response:', data);
        }
      } else {
        console.log(`❌ FAILED with status: ${res.statusCode}`);
        console.log('Response:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Request error: ${e.message}`);
    console.log('Make sure the server is running on port 5000');
  });

  req.end();
}

function getStateName(stateNumber) {
  const stateNames = [
    'Harvested', 
    'ForSaleByFarmer', 
    'PurchasedByDistributor', 
    'ShippedByDistributor', 
    'ReceivedByRetailer', 
    'ForSaleByRetailer', 
    'PurchasedByConsumer'
  ];
  
  return stateNames[parseInt(stateNumber)] || 'Unknown';
}

testAllItemsAPI();