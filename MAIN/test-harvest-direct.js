const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';

// Load the full ABI from build artifacts
const contractJSON = require('./build/contracts/AgriSupplyChain.json');
const contractABI = contractJSON.abi;
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function testHarvest() {
  try {
    console.log('🌱 Testing Harvest Directly');
    console.log('===========================');
    
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    const farmerAccount = accounts[0];
    console.log(`Using farmer account: ${farmerAccount}`);
    
    // Check if account is registered as farmer
    const isFarmer = await contract.methods.isFarmer(farmerAccount).call();
    console.log(`Is farmer: ${isFarmer}`);
    
    if (!isFarmer) {
      console.log('🔧 Adding farmer first...');
      const addFarmerTx = await contract.methods.addFarmer(farmerAccount).send({ 
        from: farmerAccount, 
        gas: 3000000 
      });
      console.log(`✅ Farmer added, tx: ${addFarmerTx.transactionHash}`);
      
      // Verify farmer was added
      const isNowFarmer = await contract.methods.isFarmer(farmerAccount).call();
      console.log(`Is now farmer: ${isNowFarmer}`);
    }
    
    // Check current item counter
    const counterBefore = await contract.methods.itemCounter().call();
    console.log(`Item counter before harvest: ${counterBefore.toString()}`);
    
    // Try to harvest an item
    console.log('🌾 Harvesting item...');
    const harvestTx = await contract.methods.harvestItem(
      'Test Tomatoes',
      'Direct Farm',
      1500,
      'Grade A+'
    ).send({ 
      from: farmerAccount, 
      gas: 3000000 
    });
    
    console.log(`✅ Harvest transaction successful!`);
    console.log(`   Transaction hash: ${harvestTx.transactionHash}`);
    console.log(`   Gas used: ${harvestTx.gasUsed}`);
    
    // Check counter after harvest
    const counterAfter = await contract.methods.itemCounter().call();
    console.log(`Item counter after harvest: ${counterAfter.toString()}`);
    
    if (BigInt(counterAfter) > BigInt(counterBefore)) {
      console.log('✅ Item successfully added to blockchain!');
      
      // Try to retrieve the item
      const itemId = counterAfter.toString();
      console.log(`📦 Retrieving item ${itemId}...`);
      
      const item = await contract.methods.items(itemId).call();
      console.log('Item data:');
      console.log(`  ID: ${item[0].toString()}`);
      console.log(`  Name: ${item[1]}`);
      console.log(`  Origin: ${item[2]}`);
      console.log(`  Price: ${item[3].toString()} wei`);
      console.log(`  Quality: ${item[4]}`);
      console.log(`  State: ${item[5].toString()}`);
      console.log(`  Farmer: ${item[6]}`);
      
      // Test the server endpoint now
      console.log('🌐 Testing server endpoint...');
      // Wait a moment for the server to be ready
      setTimeout(async () => {
        try {
          const response = await fetch(`http://localhost:5000/item/${itemId}`);
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Server endpoint working:', data);
          } else {
            const error = await response.text();
            console.log('❌ Server endpoint error:', error);
          }
        } catch (fetchError) {
          console.log('❌ Server fetch error:', fetchError.message);
        }
      }, 1000);
      
    } else {
      console.log('❌ Item counter did not increase - harvest may have failed');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    if (error.receipt) {
      console.log('Transaction receipt:', error.receipt);
    }
  }
}

testHarvest();
