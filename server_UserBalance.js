// app.js

const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(mongodb, {//Instead of MongoDB give the API key for Mongo database
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
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
        const transactions = await Transaction.find({ $or: [{ from: address }, { to: address }] });
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Calculate User Balance
const calculateUserBalance = async (address) => {
    try {
        const transactions = await Transaction.find({ $or: [{ from: address }, { to: address }] });
        let balance = 0;
        transactions.forEach(transaction => {
            if (transaction.from === address) {
                balance -= parseFloat(transaction.value);
            } else if (transaction.to === address) {
                balance += parseFloat(transaction.value);
            }
        });
        return balance;
    } catch (error) {
        console.error('Error calculating user balance:', error);
        throw error;
    }
};

// Fetch Ethereum Price
const fetchEthereumPrice = async () => {
    try {
        const response = await axios.get(AxiosAPI);//instead of AxiosAPI give the actual API key
        return response.data.ethereum.inr;
    } catch (error) {
        console.error('Error fetching Ethereum price:', error);
        throw error;
    }
};

// API Endpoint to Get User Balance and Ethereum Price
app.get('/user/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const balance = await calculateUserBalance(address);
        const ethereumPrice = await fetchEthereumPrice();
        res.json({ balance, ethereumPrice });
    } catch (error) {
        console.error('Error getting user balance and Ethereum price:', error);
        res.status(500).json({ error: 'Failed to get user balance and Ethereum price' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
