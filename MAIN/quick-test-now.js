const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';

const contractABI = [
  {
    "inputs": [],
    "name": "itemCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function quickTest() {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log('Current first account:', accounts[0]);
    
    const counter = await contract.methods.itemCounter().call();
    console.log('Item counter:', counter.toString());
    
    if (BigInt(counter) === BigInt(0)) {
      console.log('\n❌ NO ITEMS EXIST! You need to:');
      console.log('1. POST to addfarmer with account:', accounts[0]);
      console.log('2. POST to harvest with account:', accounts[0]);
      console.log('3. Then GET item/1 will work');
    } else {
      console.log('✅ Items exist, GET should work');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

quickTest();
