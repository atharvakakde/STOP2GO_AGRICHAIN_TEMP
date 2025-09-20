const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0xb735AC88C8f6a7C24D740f7b99d3Ff0Bd3670AB5';

const contractABI = [
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "isFarmer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function checkFarmer() {
  try {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    console.log('Checking if account is farmer:', account);
    
    const isFarmer = await contract.methods.isFarmer(account).call();
    console.log('Is farmer:', isFarmer);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkFarmer();
