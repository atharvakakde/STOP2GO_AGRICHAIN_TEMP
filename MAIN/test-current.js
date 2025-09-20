const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0x6689a647694c84fC3819073DD234Efb8E2720Aca';

const contractABI = [
  {
    "inputs": [],
    "name": "itemCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "items",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "origin", "type": "string"},
      {"internalType": "uint256", "name": "price", "type": "uint256"},
      {"internalType": "string", "name": "quality", "type": "string"},
      {"internalType": "enum AgriSupplyChain.State", "name": "state", "type": "uint8"},
      {"internalType": "address", "name": "farmer", "type": "address"},
      {"internalType": "address", "name": "distributor", "type": "address"},
      {"internalType": "address", "name": "retailer", "type": "address"},
      {"internalType": "address", "name": "consumer", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function testCurrentState() {
  try {
    console.log('Testing current contract state...');
    console.log('Contract address:', contractAddress);
    
    // Check item counter
    const counter = await contract.methods.itemCounter().call();
    console.log('Item counter:', counter.toString());
    
    if (BigInt(counter) > 0) {
      console.log('\nTrying to get item 1...');
      const item = await contract.methods.items(1).call();
      console.log('Item 1 data:');
      console.log('- ID:', item[0]?.toString());
      console.log('- Name:', item[1]);
      console.log('- Origin:', item[2]);
      console.log('- Price:', item[3]?.toString());
      console.log('- Quality:', item[4]);
      console.log('- State:', item[5]?.toString());
      console.log('- Farmer:', item[6]);
      console.log('- Distributor:', item[7]);
      console.log('- Retailer:', item[8]);
      console.log('- Consumer:', item[9]);
    } else {
      console.log('No items exist yet - you need to harvest an item first');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCurrentState();
