const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');

// Load the contract
const contractJSON = require('./build/contracts/AgriSupplyChain.json');
const contractABI = contractJSON.abi;
const networkId = '1758364051348';
const deployed = contractJSON.networks && contractJSON.networks[networkId];
if (!deployed || !deployed.address) {
  console.error('Contract not deployed. Run: npx truffle migrate --reset');
  process.exit(1);
}
const contractAddress = deployed.address;
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function fixItemTracking() {
  try {
    console.log('🔧 FIXING ITEM TRACKING ISSUE');
    console.log('==============================');
    
    const farmerAccount = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';
    
    // Step 1: Add farmer
    console.log('Step 1: Adding farmer...');
    const addFarmerTx = await contract.methods.addFarmer(farmerAccount).send({
      from: farmerAccount,
      gas: 3000000
    });
    console.log(`✅ Farmer added! Tx: ${addFarmerTx.transactionHash}`);
    
    // Step 2: Verify farmer
    const isFarmer = await contract.methods.isFarmer(farmerAccount).call();
    console.log(`✅ Is Farmer: ${isFarmer}`);
    
    // Step 3: Harvest an item
    console.log('\nStep 2: Harvesting item...');
    const harvestTx = await contract.methods.harvestItem(
      'Mango',
      'Mumbai', 
      1000,
      'Premium'
    ).send({
      from: farmerAccount,
      gas: 3000000
    });
    console.log(`✅ Item harvested! Tx: ${harvestTx.transactionHash}`);
    
    // Step 4: Check item counter
    const itemCounter = await contract.methods.itemCounter().call();
    console.log(`✅ Total items: ${itemCounter.toString()}`);
    
    // Step 5: Get the item
    if (parseInt(itemCounter.toString()) > 0) {
      const item = await contract.methods.items(1).call();
      console.log('\n📦 ITEM 1 DETAILS:');
      console.log(`   Name: ${item[1]}`);
      console.log(`   Origin: ${item[2]}`);
      console.log(`   Price: ${item[3].toString()} wei`);
      console.log(`   Quality: ${item[4]}`);
      console.log(`   Farmer: ${item[6]}`);
      console.log('\n✅ SUCCESS! Item tracking is now working!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixItemTracking();