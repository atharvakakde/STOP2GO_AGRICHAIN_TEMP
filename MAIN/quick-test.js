const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0xb735AC88C8f6a7C24D740f7b99d3Ff0Bd3670AB5';

// Minimal ABI for the functions we need
const contractABI = [
  {
    "inputs": [{"internalType": "address", "name": "_farmer", "type": "address"}],
    "name": "addFarmer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_name", "type": "string"}, {"internalType": "string", "name": "_origin", "type": "string"}, {"internalType": "uint256", "name": "_price", "type": "uint256"}, {"internalType": "string", "name": "_quality", "type": "string"}],
    "name": "harvestItem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "itemCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function setupAndTest() {
  try {
    // Get accounts
    const accounts = await web3.eth.getAccounts();
    const farmerAccount = accounts[0];
    
    console.log('Using farmer account:', farmerAccount);
    
    // Add farmer
    console.log('Adding farmer...');
    await contract.methods.addFarmer(farmerAccount).send({
      from: farmerAccount,
      type: '0x0'
    });
    console.log('✅ Farmer added');
    
    // Harvest an item
    console.log('Harvesting item...');
    await contract.methods.harvestItem(
      'Tomatoes', 
      'Farm XYZ', 
      100, 
      'Grade A'
    ).send({
      from: farmerAccount,
      type: '0x0'
    });
    console.log('✅ Item harvested');
    
    // Check item counter
    const counter = await contract.methods.itemCounter().call();
    console.log('Total items:', counter.toString());
    
    console.log('\n🎉 Setup complete! Now test GET http://localhost:5000/item/1');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupAndTest();
