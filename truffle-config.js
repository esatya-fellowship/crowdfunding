const HDWalletProvider = require('@truffle/hdwallet-provider');

const MNEMONIC = 'YOUR_MNEMONIC_PHRASE';
const RINKEBY_NODE = 'https://rinkeby.infura.io/v3/e08d0fc4dd864c68ba37e292d73e063a';
const POLYGON_URL = 'https://rpc-mumbai.maticvigil.com/';
const BINANCE_TESTNET_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/';

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 7545,
            network_id: '*', // Match any network id
        },
        rinkeby: {
            provider: function () {
                return new HDWalletProvider(MNEMONIC, RINKEBY_NODE);
            },
            network_id: 4,
        },
        binanceTestnet: {
            provider: function () {
                return new HDWalletProvider(MNEMONIC, BINANCE_TESTNET_URL);
            },
            network_id: 97,
        },
        polygonTestnet: {
            provider: function () {
                return new HDWalletProvider(MNEMONIC, POLYGON_URL);
            },
            network_id: 80001,
        },
    },
    contracts_directory: './src/contracts/',
    contracts_build_directory: './src/abis/',
    compilers: {
        solc: {
            version: '^0.8.1',
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
};
