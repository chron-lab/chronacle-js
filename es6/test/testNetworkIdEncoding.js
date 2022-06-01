import { ChronnetEncoder, Utils } from ".";

describe("testNetworkIdEncoding", () => {
    it("Should encode networkId", () => {
        let networkId = 1;
        let networkIdHex = Utils.UInt16ToHex(networkId);
        networkIdHex.should.equal("0x0100");
    });
});
