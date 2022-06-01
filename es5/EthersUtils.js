"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ethers = require("ethers");

class EthersUtils {
  // SIGNATURE-----------------------------------------------------------------------
  static async SignMessage(ptekey, message) {
    let wallet = new _ethers.Wallet(ptekey);

    let hash = _ethers.ethers.utils.keccak256(message);

    let signature = await wallet.signMessage(_ethers.ethers.utils.arrayify(hash));
    return signature;
  }
  /* Pack array of 65 bytes signatures into a single array */


  static PackSignatures(signatures) {
    let result = "";
    signatures.forEach(s => {
      result = `${result}${s.slice(2)}`;
    });
    return `0x${result}`;
  }

}

var _default = EthersUtils;
exports.default = _default;
module.exports = exports.default;