const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');

// Load the contract
const contractJSON = require('./build/contracts/AgriSupplyChain.json');
const contractABI = contractJSON.abi;
const networkId = '1758097798747';
const deployed = contractJSON.networks && contractJSON.networks[networkId];
if (!deployed || !deployed.address) {
  console.error('Contract not deployed. Run: npx truffle migrate --reset');
  process.exit(1);
}
const contractAddress = deployed.address;
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function listAllItems() {
  try {
    console.log('📦 LISTING ALL ITEMS IN YOUR AGRICHAIN');
    console.log('=====================================');
    
    // Get total number of items
    const itemCounter = await contract.methods.itemCounter().call();
    const totalItems = parseInt(itemCounter.toString());
    
    console.log(`Total Items Created: ${totalItems}`);
    
    if (totalItems === 0) {
      console.log('❌ No items found. Create some items first!');
      return;
    }
    
    console.log('\n🌾 ITEM DETAILS:');
    console.log('================');
    
    // Loop through all items (starting from 1, as item 0 doesn't exist)
    for (let i = 1; i <= totalItems; i++) {
      console.log(`\n📦 ITEM ${i}:`);
      
      try {
        const item = await contract.methods.items(i).call();
        
        // Format the state
        const stateNames = [
          'Harvested', 
          'ForSaleByFarmer', 
          'PurchasedByDistributor', 
          'ShippedByDistributor', 
          'ReceivedByRetailer', 
          'ForSaleByRetailer', 
          'PurchasedByConsumer'
        ];
        
        const stateName = stateNames[parseInt(item[5].toString())] || 'Unknown';
        
        console.log(`   🍎 Name: ${item[1]}`);
        console.log(`   📍 Origin: ${item[2]}`);
        console.log(`   💰 Price: ${item[3].toString()} wei (${web3.utils.fromWei(item[3].toString(), 'ether')} ETH)`);
        console.log(`   ⭐ Quality: ${item[4]}`);
        console.log(`   📊 State: ${stateName} (${item[5].toString()})`);
        console.log(`   👨‍🌾 Farmer: ${item[6]}`);
        console.log(`   🚛 Distributor: ${item[7] === '0x0000000000000000000000000000000000000000' ? 'Not assigned' : item[7]}`);
        console.log(`   🏪 Retailer: ${item[8] === '0x0000000000000000000000000000000000000000' ? 'Not assigned' : item[8]}`);
        console.log(`   👥 Consumer: ${item[9] === '0x0000000000000000000000000000000000000000' ? 'Not purchased' : item[9]}`);
        
      } catch (itemError) {
        console.log(`   ❌ Error loading item ${i}: ${itemError.message}`);
      }
    }
    
    console.log('\n✅ All items listed successfully!');
    
  } catch (error) {
    console.error('❌ Error listing items:', error.message);
  }
}

listAllItems();