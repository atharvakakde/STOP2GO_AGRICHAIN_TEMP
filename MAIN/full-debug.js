const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0x7626D8b0E955Ee5ab3c1bFF01100c800175be9d2';

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

async function fullDebug() {
  try {
    console.log('=== FULL DEBUG REPORT ===');
    console.log('Contract address:', contractAddress);
    
    // Check connection
    const networkId = await web3.eth.net.getId();
    console.log('Network ID:', networkId.toString());
    
    const accounts = await web3.eth.getAccounts();
    console.log('Available accounts:', accounts.length);
    console.log('First account:', accounts[0]);
    
    // Check contract
    const code = await web3.eth.getCode(contractAddress);
    console.log('Contract deployed:', code !== '0x');
    
    // Check item counter
    console.log('\n=== ITEM COUNTER ===');
    const counter = await contract.methods.itemCounter().call();
    console.log('Total items:', counter.toString());
    
    // Try to access items
    if (BigInt(counter) > 0) {
      console.log('\n=== TRYING TO ACCESS ITEMS ===');
      for (let i = 1; i <= Math.min(3, parseInt(counter)); i++) {
        try {
          console.log(`\nTrying item ${i}...`);
          const item = await contract.methods.items(i).call();
          console.log('SUCCESS! Item data:');
          console.log('- Raw response:', item);
          console.log('- ID (item[0]):', item[0]?.toString());
          console.log('- Name (item[1]):', item[1]);
          console.log('- Origin (item[2]):', item[2]);
          console.log('- Price (item[3]):', item[3]?.toString());
          console.log('- Quality (item[4]):', item[4]);
          console.log('- State (item[5]):', item[5]?.toString());
          console.log('- Farmer (item[6]):', item[6]);
        } catch (itemError) {
          console.log(`FAILED to get item ${i}:`, itemError.message);
        }
      }
    } else {
      console.log('No items to check - counter is 0');
    }
    
    // Test backend endpoint
    console.log('\n=== TESTING BACKEND ===');
    try {
      const response = await fetch('http://localhost:5000/item/1');
      console.log('Backend status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Backend returned:', data);
      } else {
        const error = await response.text();
        console.log('Backend error:', error);
      }
    } catch (fetchError) {
      console.log('Backend fetch error:', fetchError.message);
    }
    
  } catch (error) {
    console.error('DEBUG ERROR:', error.message);
  }
}

fullDebug();
