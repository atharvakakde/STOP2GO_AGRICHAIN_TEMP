const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0xb735AC88C8f6a7C24D740f7b99d3Ff0Bd3670AB5';

const contractABI = [
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

async function testGetItem() {
  try {
    // First check item counter
    const counter = await contract.methods.itemCounter().call();
    console.log('Item counter:', counter.toString());
    
    if (BigInt(counter) === BigInt(0)) {
      console.log('No items exist yet');
      return;
    }
    
    // Try to get item 1
    console.log('\nTesting getItem(1)...');
    const item = await contract.methods.getItem(1).call();
    console.log('Raw item response:', item);
    console.log('Type of response:', typeof item);
    console.log('Is array:', Array.isArray(item));
    
    // Try different ways to access data
    if (item && typeof item === 'object') {
      console.log('\nTrying object property access:');
      console.log('item.id:', item.id);
      console.log('item.name:', item.name);
      console.log('item[0]:', item[0]);
      console.log('item[1]:', item[1]);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testGetItem();
