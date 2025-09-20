const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');

async function checkNetwork() {
  try {
    const networkId = await web3.eth.net.getId();
    console.log('Current network ID:', networkId.toString());
    
    const accounts = await web3.eth.getAccounts();
    console.log('Available accounts:', accounts.length);
    console.log('First account:', accounts[0]);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkNetwork();
