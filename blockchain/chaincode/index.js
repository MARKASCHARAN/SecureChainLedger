// blockchain/chaincode/index.js
'use strict';

const PharmaLedgerContract = require('./src/pharma-contract.js');

module.exports.PharmaLedgerContract = PharmaLedgerContract;
module.exports.contracts = [PharmaLedgerContract];
