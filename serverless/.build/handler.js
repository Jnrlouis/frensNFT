"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var transactions_1 = require("@stacks/transactions");
var network_1 = require("@stacks/network");
var Script = require('bitcore-lib/lib/script');
var Opcode = require('bitcore-lib/lib/opcode');
var Networks = require('bitcore-lib/lib/networks');
var Transaction = require('bitcore-lib/lib/transaction');
var PrivateKey = require('bitcore-lib/lib/privatekey');
var Signature = require('bitcore-lib/lib/crypto/signature');
var _a = require('bitcore-lib/lib/transaction'), Output = _a.Output, Input = _a.Input;
var frensAuthority = {
    stxAddress: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
    btcAddress: "mr1iPkD9N3RJZZxXRk7xF9d36gffa6exNC",
};
var frensToken = {
    contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    contractName: "mint-nft",
    assetName: "fren"
};
var BITCOIN_NODE_URL = "http://localhost:18443";
var STACKS_NODE_URL = "http://localhost:20443";
module.exports.btcFrens = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var chainEvent, satsAmount, recipientPubkey, script, hashBytes, recipientAddress, network, nonce, txOptions, tx, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chainEvent = JSON.parse(event.body);
                satsAmount = chainEvent.apply[0].transaction.metadata.outputs[0].value;
                if (satsAmount != 100000000) {
                    return [2 /*return*/, {
                            statusCode: 301,
                        }];
                }
                recipientPubkey = chainEvent.apply[0].transaction.metadata.outputs[1].script_pubkey;
                script = Script.fromBuffer(Buffer.from(recipientPubkey, "hex"));
                hashBytes = script.getPublicKeyHash().toString('hex');
                recipientAddress = (0, transactions_1.addressFromHashMode)(transactions_1.AddressHashMode.SerializeP2PKH, transactions_1.TransactionVersion.Testnet, hashBytes);
                if ((0, transactions_1.addressToString)(recipientAddress) === frensAuthority.stxAddress) {
                    return [2 /*return*/, {
                            statusCode: 301,
                        }];
                }
                network = new network_1.StacksTestnet({ url: STACKS_NODE_URL });
                return [4 /*yield*/, (0, transactions_1.getNonce)(frensAuthority.stxAddress, network)];
            case 1:
                nonce = _a.sent();
                txOptions = {
                    contractAddress: frensToken.contractAddress,
                    contractName: frensToken.contractName,
                    functionName: "mint",
                    functionArgs: [(0, transactions_1.standardPrincipalCVFromAddress)(recipientAddress)],
                    fee: 1000,
                    nonce: nonce,
                    network: network,
                    anchorMode: transactions_1.AnchorMode.OnChainOnly,
                    postConditionMode: transactions_1.PostConditionMode.Allow,
                    senderKey: process.env.AUTHORITY_SECRET_KEY,
                };
                return [4 /*yield*/, (0, transactions_1.makeContractCall)(txOptions)];
            case 2:
                tx = _a.sent();
                return [4 /*yield*/, (0, transactions_1.broadcastTransaction)(tx, network)];
            case 3:
                result = _a.sent();
                console.log("Result: ", result);
                return [2 /*return*/, {
                        statusCode: 200,
                        body: JSON.stringify({
                            result: result,
                        }, null, 2),
                    }];
        }
    });
}); };
//# sourceMappingURL=handler.js.map