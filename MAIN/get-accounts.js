const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');

async function getAllAccounts() {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log('All available accounts:');
    accounts.forEach((account, index) => {
      console.log(`Account ${index + 1}: ${account}`);
    });
    
    // Format for easy copy-paste into React
    console.log('\nFormatted for React App.js:');
    console.log('[');
    accounts.slice(0, 5).forEach((account, index) => {
      const comma = index < 4 ? ',' : '';
      console.log(`    '${account}'${comma}`);
    });
    console.log(']');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getAllAccounts();
