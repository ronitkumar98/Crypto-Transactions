//Ethereum Prices after 10 mins
const ethereumPriceSchema = new mongoose.Schema({
    price: Number,
    timestamp: { type: Date, default: Date.now }
});
const EthereumPrice = mongoose.model('EthereumPrice', ethereumPriceSchema);


const fetchAndStoreEthereumPrice = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const ethereumPrice = response.data.ethereum.inr;
        const newEthereumPrice = new EthereumPrice({ price: ethereumPrice });
        await newEthereumPrice.save();
        console.log('Ethereum price fetched and stored:', ethereumPrice);
    } catch (error) {
        console.error('Error fetching Ethereum price:', error);
    }
};

