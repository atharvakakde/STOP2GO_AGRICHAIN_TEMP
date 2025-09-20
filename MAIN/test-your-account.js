const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0x24cbd61AbC86242cA752d8445a2E76A8c79FbeB4';

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
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "isFarmer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function testWithYourAccount() {
  try {
    const yourAccount = '0xb23fa834C0345F433Af14657163e0722986dB517';
    
    console.log('Testing with your account:', yourAccount);
    
    // Check if farmer
    const isFarmer = await contract.methods.isFarmer(yourAccount).call();
    console.log('Is farmer:', isFarmer);
    
    // Check item counter
    const counter = await contract.methods.itemCounter().call();
    console.log('Item counter:', counter.toString());
    
    if (BigInt(counter) > 0) {
      console.log('\nTrying to get item 1...');
      try {
        const item = await contract.methods.items(1).call();
        console.log('SUCCESS! Item 1 data:');
        console.log('- ID:', item[0]?.toString());
        console.log('- Name:', item[1]);
        console.log('- Origin:', item[2]);
        console.log('- Price:', item[3]?.toString());
        console.log('- Quality:', item[4]);
        console.log('- State:', item[5]?.toString());
        console.log('- Farmer:', item[6]);
      } catch (itemError) {
        console.log('Item access failed:', itemError.message);
      }
    } else {
      console.log('No items exist - itemCounter is 0');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testWithYourAccount();
