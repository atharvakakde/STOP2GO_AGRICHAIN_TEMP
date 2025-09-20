const express = require('express');
const { Web3 } = require('web3');  // v4 import
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

const web3 = new Web3('http://127.0.0.1:7545');

// Load ABI and deployed address from Truffle build
const artifactPath = path.join(__dirname, '..', 'build', 'contracts', 'AgriSupplyChain.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const contractABI = artifact.abi;
const networkId = '1758364051348';
const deployed = artifact.networks && artifact.networks[networkId];
if (!deployed || !deployed.address) {
  console.error('AgriSupplyChain not deployed for network 5777. Run truffle migrate.');
  process.exit(1);
}
const contract = new web3.eth.Contract(contractABI, deployed.address);

// Enable CORS for React frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Get current blockchain accounts
app.get('/accounts', async (req, res) => {
    try {
        const accounts = await web3.eth.getAccounts();
        res.json(accounts);
    } catch (error) {
        console.error('Get accounts error:', error.message);
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.post('/addfarmer', async (req, res) => {
    try {
        console.log('Received body:', req.body);
        const { account } = req.body;
        console.log('Extracted account:', account);
        if (!account) throw new Error('Account required');
        const tx = await contract.methods.addFarmer(account).send({ from: account, gas: 3000000 });
        res.send('Farmer added');
    } catch (error) {
        console.error('AddFarmer error:', error.message);
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.post('/harvest', async (req, res) => {
    try {
        const { name, origin, price, quality, account } = req.body;
        if (!name || !origin || !price || !quality || !account || account.length !== 42 || !account.startsWith('0x')) {
            throw new Error('Invalid input data');
        }
        console.log('Calling harvestItem with:', { name, origin, price, quality, account });
        const tx = await contract.methods.harvestItem(name, origin, parseInt(price), quality).send({
            from: account,
            gas: 3000000  // Provide adequate gas
        });
        console.log('Transaction hash:', tx.transactionHash);
        res.send('Item harvested');
    } catch (error) {
        console.error('Harvest error:', error.message, error.stack);
        res.status(500).send(`Error: ${error.message}`);
    }
});

// Get all items
app.get('/items', async (req, res) => {
    try {
        console.log('Fetching all items');
        
        const itemCounter = await contract.methods.itemCounter().call();
        const totalItems = parseInt(itemCounter.toString());
        
        if (totalItems === 0) {
            return res.json({ totalItems: 0, items: [] });
        }
        
        const items = [];
        
        for (let i = 1; i <= totalItems; i++) {
            try {
                const item = await contract.methods.items(i).call();
                
                // Only include items that exist (have a farmer)
                if (item[6] !== '0x0000000000000000000000000000000000000000') {
                    const safeItem = {
                        id: item[0].toString(),
                        name: item[1],
                        origin: item[2],
                        price: item[3].toString(),
                        quality: item[4],
                        state: item[5].toString(),
                        farmer: item[6],
                        distributor: item[7],
                        retailer: item[8],
                        consumer: item[9]
                    };
                    items.push(safeItem);
                }
            } catch (itemError) {
                console.log(`Error loading item ${i}:`, itemError.message);
            }
        }
        
        res.json({ totalItems, items });
        
    } catch (error) {
        console.error('Get all items error:', error.message);
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.get('/item/:id', async (req, res) => {
    try {
        console.log('Fetching item with ID:', req.params.id);
        
        // First check if the item ID is within valid range
        const itemCounter = await contract.methods.itemCounter().call();
        const requestedId = parseInt(req.params.id);
        
        if (requestedId <= 0 || requestedId > parseInt(itemCounter.toString())) {
            return res.status(404).send(`Item ${req.params.id} not found`);
        }
        
        const item = await contract.methods.items(req.params.id).call();
        
        // Check if item exists by verifying farmer is not zero address
        if (item[6] === '0x0000000000000000000000000000000000000000') {
            return res.status(404).send(`Item ${req.params.id} not found`);
        }
        
        // Convert BigInt fields to strings - access as struct properties
        const safeItem = {
            id: item[0].toString(),
            name: item[1],
            origin: item[2],
            price: item[3].toString(),
            quality: item[4],
            state: item[5].toString(),
            farmer: item[6],
            distributor: item[7],
            retailer: item[8],
            consumer: item[9]
        };
        console.log('Safe item data:', safeItem);
        res.json(safeItem);
    } catch (error) {
        console.error('Get item error:', error.message, error.stack);
        if (error.message.includes('Returned values aren\'t valid')) {
            res.status(404).send(`Item ${req.params.id} not found or invalid data`);
        } else {
            res.status(500).send(`Error: ${error.message}`);
        }
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
