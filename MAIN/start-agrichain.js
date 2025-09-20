const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Web3 } = require('web3');

console.log('🚀 STARTING AGRICHAIN COMPLETE SETUP');
console.log('====================================');

let ganacheProcess, serverProcess;

// Cleanup function
function cleanup() {
    console.log('\n🛑 Shutting down processes...');
    if (ganacheProcess) {
        ganacheProcess.kill('SIGTERM');
        console.log('✅ Ganache stopped');
    }
    if (serverProcess) {
        serverProcess.kill('SIGTERM');
        console.log('✅ Server stopped');
    }
    process.exit(0);
}

// Handle cleanup on exit
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

async function startGanache() {
    return new Promise((resolve, reject) => {
        console.log('Step 1: Starting Ganache blockchain network...');
        
        ganacheProcess = spawn('npx', [
            'ganache',
            '--port', '7545',
            '--deterministic',
            '--accounts', '10',
            '--hardfork', 'london',
            '--chain.vmErrorsOnRPCResponse',
            '--database.dbPath', './ganache_db',
            '--wallet.seed', 'agrichain_seed_2024'
        ], { stdio: 'pipe', shell: true });

        let ganacheReady = false;

        ganacheProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('📟 Ganache:', output.trim());
            
            if (output.includes('Listening on') && !ganacheReady) {
                ganacheReady = true;
                setTimeout(() => resolve(), 2000); // Wait 2 seconds for full startup
            }
        });

        ganacheProcess.stderr.on('data', (data) => {
            console.log('⚠️  Ganache Error:', data.toString().trim());
        });

        ganacheProcess.on('close', (code) => {
            if (code !== 0 && code !== null) {
                reject(new Error(`Ganache exited with code ${code}`));
            }
        });

        // Timeout after 30 seconds
        setTimeout(() => {
            if (!ganacheReady) {
                reject(new Error('Ganache startup timeout'));
            }
        }, 30000);
    });
}

async function deployContract() {
    return new Promise((resolve, reject) => {
        console.log('\nStep 2: Deploying smart contract...');
        
        const migrateProcess = spawn('npx', ['truffle', 'migrate', '--reset', '--network', 'development'], {
            stdio: 'pipe',
            shell: true
        });

        let contractAddress = '';
        let networkId = '';

        migrateProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('📄 Contract:', output.trim());
            
            // Extract contract address
            const addressMatch = output.match(/contract address:\s*(0x[a-fA-F0-9]{40})/);
            if (addressMatch) {
                contractAddress = addressMatch[1];
            }
            
            // Extract network ID
            const networkMatch = output.match(/Network id:\s*(\d+)/);
            if (networkMatch) {
                networkId = networkMatch[1];
            }
        });

        migrateProcess.stderr.on('data', (data) => {
            console.log('⚠️  Migration Error:', data.toString().trim());
        });

        migrateProcess.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ Contract deployed at: ${contractAddress}`);
                console.log(`✅ Network ID: ${networkId}`);
                resolve({ contractAddress, networkId });
            } else {
                reject(new Error(`Contract deployment failed with code ${code}`));
            }
        });
    });
}

async function updateServerConfig(networkId) {
    console.log('\nStep 3: Updating server configuration...');
    
    const serverPath = path.join(__dirname, 'server', 'index.js');
    let serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Update network ID in server
    serverContent = serverContent.replace(
        /const networkId = '[^']*';/,
        `const networkId = '${networkId}';`
    );
    
    fs.writeFileSync(serverPath, serverContent);
    console.log(`✅ Server updated with network ID: ${networkId}`);
}

async function createTestData(networkId) {
    console.log('\nStep 4: Creating test data...');
    
    try {
        const web3 = new Web3('http://127.0.0.1:7545');
        
        // Load contract
        const contractJSON = require('./build/contracts/AgriSupplyChain.json');
        const contractABI = contractJSON.abi;
        const deployed = contractJSON.networks && contractJSON.networks[networkId];
        
        if (!deployed || !deployed.address) {
            throw new Error('Contract not properly deployed');
        }
        
        const contract = new web3.eth.Contract(contractABI, deployed.address);
        const farmerAccount = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';
        
        // Add farmer
        console.log('🧑‍🌾 Adding farmer...');
        await contract.methods.addFarmer(farmerAccount).send({
            from: farmerAccount,
            gas: 3000000
        });
        
        // Create test items
        const testItems = [
            { name: 'Mango', origin: 'Mumbai', price: 1000, quality: 'Premium' },
            { name: 'Rice', origin: 'Punjab', price: 500, quality: 'Organic' },
            { name: 'Wheat', origin: 'Haryana', price: 300, quality: 'Standard' }
        ];
        
        for (let i = 0; i < testItems.length; i++) {
            const item = testItems[i];
            console.log(`🌾 Creating item ${i + 1}: ${item.name} from ${item.origin}`);
            
            await contract.methods.harvestItem(
                item.name,
                item.origin,
                item.price,
                item.quality
            ).send({
                from: farmerAccount,
                gas: 3000000
            });
        }
        
        console.log('✅ Test data created successfully!');
        
    } catch (error) {
        console.error('❌ Error creating test data:', error.message);
        throw error;
    }
}

async function startServer() {
    return new Promise((resolve, reject) => {
        console.log('\nStep 5: Starting backend server...');
        
        serverProcess = spawn('npm', ['run', 'start:server'], {
            stdio: 'pipe',
            shell: true
        });

        let serverReady = false;

        serverProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('🖥️  Server:', output.trim());
            
            if (output.includes('Server on port') && !serverReady) {
                serverReady = true;
                resolve();
            }
        });

        serverProcess.stderr.on('data', (data) => {
            console.log('⚠️  Server Error:', data.toString().trim());
        });

        serverProcess.on('close', (code) => {
            if (code !== 0 && code !== null) {
                reject(new Error(`Server exited with code ${code}`));
            }
        });

        // Timeout after 15 seconds
        setTimeout(() => {
            if (!serverReady) {
                reject(new Error('Server startup timeout'));
            }
        }, 15000);
    });
}

// Main startup sequence
async function main() {
    try {
        await startGanache();
        const { networkId } = await deployContract();
        await updateServerConfig(networkId);
        await createTestData(networkId);
        await startServer();
        
        console.log('\n🎉 AGRICHAIN SETUP COMPLETE!');
        console.log('===============================');
        console.log('✅ Ganache blockchain: http://127.0.0.1:7545');
        console.log('✅ Backend server: http://localhost:5000');
        console.log('✅ Test items created: Mango (ID: 1), Rice (ID: 2), Wheat (ID: 3)');
        console.log('\n📱 You can now start the React frontend with:');
        console.log('   npm run start:client');
        console.log('\n🔍 Test tracking items at: http://localhost:3000');
        console.log('\n⚠️  Press Ctrl+C to stop all services');
        
        // Keep the process running
        await new Promise(() => {});
        
    } catch (error) {
        console.error('\n❌ Startup failed:', error.message);
        cleanup();
        process.exit(1);
    }
}

main();