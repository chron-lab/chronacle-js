"use strict";

var _ = require(".");

describe("testNetworkIdEncoding", () => {
  it("Should encode networkId", () => {
    let networkId = 1;

    let networkIdHex = _.Utils.UInt16ToHex(networkId);

    networkIdHex.should.equal("0x0100");
  });
});