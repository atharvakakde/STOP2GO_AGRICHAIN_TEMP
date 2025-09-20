const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0x7626D8b0E955Ee5ab3c1bFF01100c800175be9d2';

// Test with minimal ABI first
const contractABI = [
  {
    "inputs": [],
    "name": "itemCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
    "name": "getItem",
    "outputs": [
      {
        "components": [
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
        "internalType": "struct AgriSupplyChain.Item",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function debugGetItem() {
  try {
    console.log('Testing contract at:', contractAddress);
    
    // Check item counter first
    const counter = await contract.methods.itemCounter().call();
    console.log('Item counter:', counter.toString());
    
    if (BigInt(counter) > 0) {
      console.log('\nTrying getItem(1)...');
      const item = await contract.methods.getItem(1).call();
      console.log('Success! Raw item data:', item);
      console.log('Item type:', typeof item);
      console.log('Item keys:', Object.keys(item));
      
      // Try both access methods
      console.log('\nTrying struct access:');
      console.log('item.id:', item.id?.toString());
      console.log('item.name:', item.name);
      
      console.log('\nTrying array access:');
      console.log('item[0]:', item[0]?.toString());
      console.log('item[1]:', item[1]);
      
    } else {
      console.log('No items found in contract. Counter is 0.');
    }
    
  } catch (error) {
    console.error('Debug error:', error.message);
    console.error('Full error:', error);
  }
}

debugGetItem();
