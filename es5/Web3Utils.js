"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _web = require("web3");

var _Utils = require("./Utils");

class Web3Utils {
  constructor(provider) {
    this.web3 = new _web(provider);
  } // WEB3---------------------------------------------------------------------------


  convertEthUnit(value, fromUnit, toUnit) {
    return Web3Utils.ConvertEthUnit(value, fromUnit, toUnit);
  }

  static ConvertEthUnit(value, fromUnit, toUnit) {
    let valueInWei = _web.utils.toWei(value, fromUnit);

    return _web.utils.fromWei(valueInWei, toUnit);
  }

  getAccounts() {
    return _Utils.Promisify(this.web3.eth.getAccounts);
  }

  async getAccount() {
    let accounts = await this.getAccounts();
    return accounts[0];
  }

  async sendEth(recipient, ether) {
    let account = await this.getAccount();
    return await this.web3.eth.sendTransaction({
      from: account,
      to: recipient,
      value: this.web3.utils.toWei(ether.toString(), "ether")
    });
  }

  getEthBalance(account) {
    if (account !== null) return this.web3.eth.getBalance(account);
  }

  allEvents(contract) {
    return contract.events.allEvents(function (error, ev) {
      if (error) {
        console.error(error);
        return;
      }

      if (ev.type == "mined") console.log(`${ev.event}(${JSON.stringify(ev.returnValues)})`);
    });
  }

  async deployContract(abi, bytecode, gas, args) {
    let account = await this.getAccount();
    return this.deployContractFrom(account, abi, bytecode, gas, args);
  }

  async deployContractFrom(account, abi, bytecode, gas, args) {
    try {
      let receipt;
      let contract = new this.web3.eth.Contract(abi);
      let deployment = await contract.deploy({
        data: bytecode,
        arguments: args
      }).send({
        from: account,
        gas: gas
      }).on("receipt", r => {
        receipt = r;
      });
      let address = deployment.options.address;
      let deployed = this.newContractFrom(account, abi, address);
      deployed.address = address;
      deployed.abi = abi;
      deployed.receipt = receipt;
      return deployed;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async newContract(abi, contractAddr) {
    let account = await this.getAccount();
    return this.newContractFrom(account, abi, contractAddr);
  }

  newContractFrom(account, abi, contractAddr) {
    let contract = new this.web3.eth.Contract(abi, contractAddr, {
      from: account
    });
    contract.address = contract._address;
    return contract;
  }

  async estimateDeploymentGas(abi, bytecode, args) {
    try {
      let contract = new this.web3.eth.Contract(abi);
      let gas = await contract.deploy({
        data: bytecode,
        arguments: args
      }).estimateGas();
      return gas;
    } catch (err) {
      console.error(err);
      throw err;
    }
  } // SIGNATURE-----------------------------------------------------------------------

  /* Use web3.eth.sign but replace v with v+27 */


  async signMessage(account, message) {
    let hash = this.web3.utils.keccak256(message);
    let signature = await this.web3.eth.sign(hash, account);
    let v = (parseInt(signature.substr(130, 2)) + 27).toString(16);
    signature = signature.slice(0, 130) + v;
    return signature;
  }
  /* Pack array of 65 bytes signatures into a single array */


  packSignatures(signatures) {
    let result = "";
    signatures.forEach(s => {
      result = `${result}${s.slice(2)}`;
    });
    return `0x${result}`;
  }

}

var _default = Web3Utils;
exports.default = _default;
module.exports = exports.default;