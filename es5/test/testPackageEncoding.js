"use strict";

var _ = require(".");

describe("testPackageEncoding", () => {
  it("Should encode and decode erc20 package", async () => {
    const erc20Package = "0x010100148da577cc13d484b206ba6e84c63de6cc51010fbc00000000000000000100001c00b33ef123e50dcaf001824c5fa1c0c7214ceca903a1e7dc62c42a4701010014a5b4f772223b1c24670da0f5d11d546aa6236a2f000000000000000001abffffffffffffffff87b6d44e1122334455667788990011223344556677880000000000000000000000000000000000000000000000000de0b6b3a7640000"; // ENCODE

    console.log(_.ChronnetEncoder);
    let originatorId = await _.ChronnetEncoder.EncodeAddressId(1, "0x8Da577cc13D484B206Ba6e84C63DE6cc51010fbC");
    let recipientId = await _.ChronnetEncoder.EncodeAddressId(0, "0x00B33EF123E50DCAF001824C5FA1C0C7214CECA903A1E7DC62C42A47");
    let tokenId = await _.ChronnetEncoder.EncodeAddressId(1, "0xa5b4f772223b1c24670da0f5d11d546aa6236a2f");
    let packageType = "0x01";
    let packageVersion = "0xab";
    let tokenNonce = "0xffffffffffffffff";
    let data = "0x112233445566778899001122334455667788";
    let tokenQty = "1000000000000000000";
    let encoded = await _.ChronnetEncoder.EncodeErc20Package(originatorId, recipientId, tokenId, packageType, packageVersion, tokenNonce, data, tokenQty);
    encoded.should.equal(erc20Package); // DECODE

    let decoded = _.ChronnetEncoder.DecodeErc20Package(erc20Package);

    decoded.magicNumber.should.equal("0x87b6d44e");
    decoded.data.should.equal(data);
    decoded.tokenQty.toString().should.equal(tokenQty);
    decoded.originatorId.should.equal(originatorId);
    decoded.recipientId.should.equal(recipientId);
    decoded.tokenId.should.equal(tokenId);
    decoded.packageType.toString().should.equal("0x01");
  });
  it("Should encode and decode erc721 package", async () => {
    const erc721package = "0x01010014a3cb2408f29dd2c7d50380cf79aeb32350bbc8c300000000000000000100001c00b33ef123e50dcaf001824c5fa1c0c7214ceca903a1e7dc62c42a4701010014a5b4f772223b1c24670da0f5d11d546aa6236a2f000000000000000001ab123456789012345687b6d44e1122334455667788990011223344556677880000000000000000000000000000000000000000000000000000000000000001687474703a2f2f696e666f636f72702e696f2f6e66743d313233343531313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313139393939393939393939393939";
    let originatorId = await _.ChronnetEncoder.EncodeAddressId(1, "0xa3cb2408f29Dd2C7D50380cf79aEb32350BbC8c3");
    let recipientId = await _.ChronnetEncoder.EncodeAddressId(0, "0x00B33EF123E50DCAF001824C5FA1C0C7214CECA903A1E7DC62C42A47");
    let tokenId = await _.ChronnetEncoder.EncodeAddressId(1, "0xa5b4f772223b1c24670da0f5d11d546aa6236a2f");
    let packageType = "0x01";
    let packageVersion = "0xab";
    let tokenNonce = "0x1234567890123456";
    let data = "0x112233445566778899001122334455667788";
    let nftTokenId = "1";
    let tokenUri = "http://infocorp.io/nft=123451111111111111111111111111111111111111111111111111119999999999999";

    let encoded = _.ChronnetEncoder.EncodeErc721Package(originatorId, recipientId, tokenId, packageType, packageVersion, tokenNonce, data, nftTokenId, tokenUri);

    encoded.should.equal(erc721package);

    let decoded = _.ChronnetEncoder.DecodeErc721Package(erc721package);

    console.log(decoded);
    decoded.magicNumber.should.equal("0x87b6d44e");
    decoded.data.should.equal(data);
    decoded.nftTokenId.toString().should.equal(nftTokenId);
    decoded.tokenUri.should.equal(tokenUri);
    decoded.originatorId.should.equal(originatorId);
    decoded.recipientId.should.equal(recipientId);
    decoded.tokenId.should.equal(tokenId);
    decoded.packageType.toString().should.equal("0x01");
  });
});