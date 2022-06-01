import { ChronnetEncoder, Utils } from ".";

describe("testAddressId", () => {
    it("Should convert ethereum address to AddressId", () => {
        let networkId = 1;
        let addr = "0x8Da577cc13D484B206Ba6e84C63DE6cc51010fbC";
        let addressId = ChronnetEncoder.EncodeAddressId(networkId, addr);
        addressId.should.equal(
            "0x010100148da577cc13d484b206ba6e84c63de6cc51010fbc0000000000000000"
        );
    });

    it("Should convert chronnet address to AddressId", () => {
        let networkId = 0;
        let base58 = "1RE72u8HPMBWwYFDLyjoNJHUQwyPkpwk3fc2QN";
        let addr = Utils.Base58ToHex(base58);
        let addressId = ChronnetEncoder.EncodeAddressId(networkId, addr);
        addressId.should.equal(
            "0x0100001c00b33ef123e50dcaf001824c5fa1c0c7214ceca903a1e7dc62c42a47"
        );
    });
});
