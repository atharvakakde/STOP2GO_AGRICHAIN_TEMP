const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');

// Load the contract
const contractJSON = require('./build/contracts/AgriSupplyChain.json');
const contractABI = contractJSON.abi;
const contractAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function checkFarmerStatus() {
  try {
    console.log('🔍 Checking Farmer Registration Status');
    console.log('=====================================');
    
    // Get all accounts
    const accounts = await web3.eth.getAccounts();
    console.log('Available accounts:');
    accounts.forEach((account, index) => {
      console.log(`  Account ${index}: ${account}`);
    });
    
    // Check the specific account from your image
    const targetAccount = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0';
    console.log(`\n🎯 Checking target account: ${targetAccount}`);
    
    // Check if it's registered as farmer
    const isFarmer = await contract.methods.isFarmer(targetAccount).call();
    console.log(`Is registered as farmer: ${isFarmer}`);
    
    if (!isFarmer) {
      console.log('\n❌ PROBLEM FOUND: Account is NOT registered as a farmer!');
      console.log('✅ SOLUTION: You need to add this account as a farmer first.');
      
      // Try to add the farmer
      console.log('\n🔧 Attempting to add farmer...');
      try {
        const addFarmerTx = await contract.methods.addFarmer(targetAccount).send({ 
          from: targetAccount, 
          gas: 3000000 
        });
        console.log(`✅ Farmer added successfully! Transaction: ${addFarmerTx.transactionHash}`);
        
        // Verify
        const isNowFarmer = await contract.methods.isFarmer(targetAccount).call();
        console.log(`✅ Verified - Is now farmer: ${isNowFarmer}`);
        
      } catch (addError) {
        console.log(`❌ Failed to add farmer: ${addError.message}`);
        
        // Try with a different account (owner)
        console.log('\n🔧 Trying to add farmer using owner account...');
        const ownerAccount = accounts[0];
        try {
          const addFarmerTx2 = await contract.methods.addFarmer(targetAccount).send({ 
            from: ownerAccount, 
            gas: 3000000 
          });
          console.log(`✅ Farmer added by owner! Transaction: ${addFarmerTx2.transactionHash}`);
          
          const isNowFarmer2 = await contract.methods.isFarmer(targetAccount).call();
          console.log(`✅ Verified - Is now farmer: ${isNowFarmer2}`);
        } catch (ownerError) {
          console.log(`❌ Owner also failed: ${ownerError.message}`);
        }
      }
    } else {
      console.log('✅ Account is properly registered as a farmer');
      
      // Check other possible issues
      console.log('\n🔍 Checking other potential issues...');
      
      // Check account balance
      const balance = await web3.eth.getBalance(targetAccount);
      console.log(`Account balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
      
      if (BigInt(balance) < BigInt(web3.utils.toWei('0.01', 'ether'))) {
        console.log('⚠️  WARNING: Account balance is very low, might not have enough gas');
      }
    }
    
    // Also check all registered farmers
    console.log('\n📋 Checking all accounts for farmer status:');
    for (let i = 0; i < Math.min(accounts.length, 5); i++) {
      const account = accounts[i];
      const farmerStatus = await contract.methods.isFarmer(account).call();
      console.log(`  ${account}: ${farmerStatus ? '✅ Farmer' : '❌ Not Farmer'}`);
    }
    
  } catch (error) {
    console.error('❌ Check farmer status error:', error.message);
  }
}

checkFarmerStatus();