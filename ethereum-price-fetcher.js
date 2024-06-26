//Ethereum Prices after 10 mins
//This code has already been added to the server.js fiel and is added here seperately to check and make changes
require('dotenv').config();
const ethereumPriceSchema = new mongoose.Schema({
    price: Number,
    timestamp: { type: Date, default: Date.now }
});
const EthereumPrice = mongoose.model('EthereumPrice', ethereumPriceSchema);


const fetchAndStoreEthereumPrice = async () => {
    try {
        const response = await axios.get(AxiosAPI);
        const ethereumPrice = response.data.ethereum.inr;
        const newEthereumPrice = new EthereumPrice({ price: ethereumPrice });
        await newEthereumPrice.save();
        console.log('Ethereum price fetched and stored:', ethereumPrice);
    } catch (error) {
        console.error('Error fetching Ethereum price:', error);
    }
};

setInterval(fetchAndStoreEthereumPrice, 10 * 60 * 1000);

