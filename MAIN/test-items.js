const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0xb735AC88C8f6a7C24D740f7b99d3Ff0Bd3670AB5';

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

async function testItems() {
  try {
    console.log('Checking itemCounter...');
    const counter = await contract.methods.itemCounter().call();
    console.log('Item counter:', counter.toString());
    
    if (BigInt(counter) > 0) {
      console.log('\nTesting items(1)...');
      const item = await contract.methods.items(1).call();
      console.log('Raw response:', item);
      console.log('ID:', item[0]?.toString());
      console.log('Name:', item[1]);
      console.log('Origin:', item[2]);
      console.log('Price:', item[3]?.toString());
      console.log('Quality:', item[4]);
      console.log('State:', item[5]?.toString());
      console.log('Farmer:', item[6]);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testItems();
