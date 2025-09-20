const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');

const contractABI = [
  {
    "inputs": [],
    "name": "itemCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getItem",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "origin",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "quality",
            "type": "string"
          },
          {
            "internalType": "enum AgriSupplyChain.State",
            "name": "state",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "farmer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "distributor",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "retailer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "consumer",
            "type": "address"
          }
        ],
        "internalType": "struct AgriSupplyChain.Item",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

const contractAddress = '0x372Be963097Fee2f31E2aAfCDD69fc5f3593F0Db';
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function debugContract() {
  try {
    console.log('Testing contract connectivity...');
    
    // Check if the contract exists
    const code = await web3.eth.getCode(contractAddress);
    if (code === '0x') {
      console.log('❌ Contract not deployed at this address!');
      return;
    }
    console.log('✅ Contract exists at address');
    
    // Get item counter
    console.log('\nChecking itemCounter...');
    const itemCounter = await contract.methods.itemCounter().call();
    console.log('Item Counter:', itemCounter.toString());
    
    if (BigInt(itemCounter) === BigInt(0)) {
      console.log('❌ No items have been harvested yet!');
      return;
    }
    
    // Try to get item 1
    console.log('\nTrying to fetch item 1...');
    const item = await contract.methods.getItem(1).call();
    console.log('Raw item data:', item);
    console.log('Item data type:', typeof item);
    
    // Try accessing as object properties (struct)
    console.log('\nTrying to access as struct properties:');
    console.log('ID:', item.id?.toString());
    console.log('Name:', item.name);
    console.log('Origin:', item.origin);
    
    // Try accessing as array indices
    console.log('\nTrying to access as array indices:');
    if (Array.isArray(item)) {
      console.log('Item is array with length:', item.length);
      item.forEach((value, index) => {
        console.log(`Index ${index}:`, value);
      });
    }
    
  } catch (error) {
    console.error('Debug error:', error.message);
  }
}

debugContract();
