"use strict";

var _web = require("web3");

var _ = require(".");

describe("testSignature", () => {
  it("Should sign with Web3Utils", async () => {
    let data = "0x112233445566778899001122334455667788";
    let web3Utils = new _.Web3Utils(new _web("http://localhost:8545"));
    let accounts = await web3Utils.getAccounts();
    let sig1 = await web3Utils.signMessage(accounts[0], data);
    console.log(sig1);
  });
  it("Should sign with EthersUtils", async () => {
    let data = "0x112233445566778899001122334455667788";
    let sig2 = await _.EthersUtils.SignMessage("0x04415bc01ab5b8ac3838e645c79291026dcc30c7fcbac6149127f5cc645477ee", data);
    console.log(sig2);
  }); // it("Should have same signature from WebUtils and EthersUtils", async () => {
  //     let data = "0x112233445566778899001122334455667788";
  //     let web3Utils = new Web3Utils(new Web3("http://localhost:8545"));
  //     let accounts = await web3Utils.getAccounts();
  //     let sig1 = await web3Utils.signMessage(accounts[0], data);
  //     let sig2 = await EthersUtils.SignMessage(
  //         "0x04415bc01ab5b8ac3838e645c79291026dcc30c7fcbac6149127f5cc645477ee",
  //         data
  //     );
  //     sig1.should.equal(sig2);
  // });
});