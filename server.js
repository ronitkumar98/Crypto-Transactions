const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb+srv://ronitkumar9874:uiouioui%40123@crypto-database.1hsadev.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    address:String,
    blockNumber: Number,
    timeStamp: Number,
    hash: String,
    from: String,
    to: String,
    value: String,
    confirmations: Number
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// Fetch Transactions API
app.get('/transactions/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const apiKey = 'Y323GSU4V9DEMKGVYYDXZ7IG12XNH3K3XE';
        const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${apiKey}`;
        const response = await axios.get(apiUrl);
        const transactions = response.data.result;
        transactions.forEach(async (transaction) => {
            const newTransaction = new Transaction(transaction);
            await newTransaction.save();
        });
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

//fetches price 
const fetchAndStoreEthereumPrice = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const ethereumPrice = response.data.ethereum.inr;
        const EthereumPrice = mongoose.model('EthereumPrice', { price: Number, timestamp: { type: Date, default: Date.now } });
        const newEthereumPrice = new EthereumPrice({ price: ethereumPrice });
        await newEthereumPrice.save();
        console.log('Ethereum price fetched and stored:', ethereumPrice);
    } catch (error) {
        console.error('Error fetching Ethereum price:', error);
    }
};

// Schedule task to fetch Ethereum price every 10 minutes
setInterval(fetchAndStoreEthereumPrice, 10 * 60 * 1000);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
