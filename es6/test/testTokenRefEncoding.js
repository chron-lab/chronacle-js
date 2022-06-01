import { ChronnetEncoder, Utils } from ".";

describe("testTokenRefEncoding", () => {
    it("Should convert string to TokenRef", () => {
        let ascii = "GalleryToken";
        Utils.AsciiToBytes32(ascii).should.equal(
            "0x47616c6c657279546f6b656e0000000000000000000000000000000000000000"
        );
    });

    it("Should convert bytes to TokenRef", () => {
        let hex =
            "0x47616c6c657279546f6b656e0000000000000000000000000000000000000000";
        let bytes = Utils.ToBytes(hex);
        Utils.Bytes32ToAscii(bytes).should.equal("GalleryToken");
    });
});
