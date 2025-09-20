const { Web3 } = require('web3');

const web3 = new Web3('http://127.0.0.1:7545');

// Load the contract
const contractJSON = require('./build/contracts/AgriSupplyChain.json');
const contractABI = contractJSON.abi;
const contractAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function debugHarvest() {
  try {
    console.log('🐛 Debug Harvest Transaction');
    console.log('=============================');
    
    // Use the exact same parameters from your UI
    const farmerAccount = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0';
    const productName = 'mango';
    const origin = 'mumbai';
    const price = 1200; // Wei
    const quality = 'Premium';
    
    console.log('Transaction Parameters:');
    console.log(`  Farmer Account: ${farmerAccount}`);
    console.log(`  Product Name: ${productName}`);
    console.log(`  Origin: ${origin}`);
    console.log(`  Price: ${price} wei`);
    console.log(`  Quality: ${quality}`);
    
    // Verify farmer status
    const isFarmer = await contract.methods.isFarmer(farmerAccount).call();
    console.log(`\n✅ Is Farmer: ${isFarmer}`);
    
    // Check current item counter
    const counterBefore = await contract.methods.itemCounter().call();
    console.log(`✅ Current Item Counter: ${counterBefore.toString()}`);
    
    // Check account balance
    const balance = await web3.eth.getBalance(farmerAccount);
    console.log(`✅ Account Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
    
    // Try to estimate gas first
    console.log('\n🔍 Estimating Gas...');
    try {
      const gasEstimate = await contract.methods.harvestItem(
        productName,
        origin,
        price,
        quality
      ).estimateGas({ from: farmerAccount });
      
      console.log(`✅ Gas Estimate: ${gasEstimate}`);
      
      // Try the transaction with different gas amounts
      console.log('\n🚀 Attempting Harvest Transaction...');
      
      const harvestTx = await contract.methods.harvestItem(
        productName,
        origin,
        price,
        quality
      ).send({ 
        from: farmerAccount, 
        gas: Math.floor(gasEstimate * 1.2), // 20% buffer
        gasPrice: await web3.eth.getGasPrice()
      });
      
      console.log(`✅ SUCCESS! Transaction Hash: ${harvestTx.transactionHash}`);
      console.log(`   Gas Used: ${harvestTx.gasUsed}`);
      console.log(`   Block Number: ${harvestTx.blockNumber}`);
      
      // Check counter after
      const counterAfter = await contract.methods.itemCounter().call();
      console.log(`✅ New Item Counter: ${counterAfter.toString()}`);
      
    } catch (gasError) {
      console.log(`❌ Gas estimation failed: ${gasError.message}`);
      
      // Try with manual gas limit
      console.log('\n🔧 Trying with manual gas limit...');
      try {
        const harvestTx = await contract.methods.harvestItem(
          productName,
          origin,
          price,
          quality
        ).send({ 
          from: farmerAccount, 
          gas: 3000000
        });
        
        console.log(`✅ SUCCESS with manual gas! Transaction Hash: ${harvestTx.transactionHash}`);
        
      } catch (manualGasError) {
        console.log(`❌ Manual gas also failed: ${manualGasError.message}`);
        
        // Check if it's a revert with reason
        if (manualGasError.message.includes('revert')) {
          console.log('\n🔍 Transaction was reverted by contract. Possible reasons:');
          console.log('   1. Account is not registered as farmer (but we verified it is)');
          console.log('   2. Invalid input parameters');
          console.log('   3. Contract logic error');
          
          // Let's try to call the method to see what happens
          console.log('\n🧪 Testing with contract.call() to see revert reason...');
          try {
            const result = await contract.methods.harvestItem(
              productName,
              origin,
              price,
              quality
            ).call({ from: farmerAccount });
            
            console.log('✅ Call succeeded:', result);
            console.log('   This suggests the issue is with gas or transaction parameters');
            
          } catch (callError) {
            console.log(`❌ Call also failed: ${callError.message}`);
            console.log('   This suggests there is a contract logic issue');
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Debug harvest error:', error.message);
    console.log('Full error:', error);
  }
}

debugHarvest();