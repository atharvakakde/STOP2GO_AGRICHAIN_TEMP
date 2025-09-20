const { Web3 } = require('web3');
const path = require('path');
const fs = require('fs');

const web3 = new Web3('http://127.0.0.1:7545');

// Load ABI and deployed address from Truffle build (same as server)
const artifactPath = path.join(__dirname, 'build', 'contracts', 'AgriSupplyChain.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const contractABI = artifact.abi;

console.log('Available networks in artifact:');
console.log(Object.keys(artifact.networks || {}));

// Try multiple network IDs
const networkIds = ['1758097798747', '5777', '*'];

async function testServer() {
  try {
    for (const networkId of networkIds) {
      console.log(`\n🔍 Testing network ID: ${networkId}`);
      
      const deployed = artifact.networks && artifact.networks[networkId];
      if (!deployed || !deployed.address) {
        console.log(`❌ No deployment found for network ${networkId}`);
        continue;
      }
      
      console.log(`📍 Contract address: ${deployed.address}`);
      
      const contract = new web3.eth.Contract(contractABI, deployed.address);
      
      // Test contract connection
      try {
        const counter = await contract.methods.itemCounter().call();
        console.log(`✅ Item counter: ${counter.toString()}`);
        
        if (BigInt(counter) > 0) {
          console.log(`🔍 Testing item 1...`);
          const item = await contract.methods.items(1).call();
          console.log(`✅ Item 1 exists:`, {
            id: item[0].toString(),
            name: item[1],
            origin: item[2],
            price: item[3].toString(),
            quality: item[4],
            state: item[5].toString(),
            farmer: item[6]
          });
        }
        
        console.log(`✅ Network ID ${networkId} WORKS!`);
        return;
      } catch (contractError) {
        console.log(`❌ Contract call failed: ${contractError.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Server debug error:', error.message);
  }
}

testServer();