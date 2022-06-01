"use strict";

var _ = require(".");

describe("testDataConversion", () => {
  it("Should convert between hex and base58", () => {
    _.Utils.Base58ToHex("1RE72u8HPMBWwYFDLyjoNJHUQwyPkpwk3fc2QN").should.equal("0x00b33ef123e50dcaf001824c5fa1c0c7214ceca903a1e7dc62c42a47");

    _.Utils.HexToBase58("0x00b33ef123e50dcaf001824c5fa1c0c7214ceca903a1e7dc62c42a47").should.equal("1RE72u8HPMBWwYFDLyjoNJHUQwyPkpwk3fc2QN");
  });

  function dec2hex(n) {
    return n ? [n % 256].concat(dec2hex(~~(n / 256))) : [];
  }

  function toLittleEndian(n, word) {
    var hexar = dec2hex(n);
    return hexar.map(h => (h < 16 ? "0x0" : "0x") + h.toString(16)).concat(Array(word - hexar.length).fill("0x00"));
  }

  it("Should convert endians", () => {
    parseInt(toLittleEndian(1, 4)).should.equal(1);
    let bytes = toLittleEndian(1, 4);
    bytes[0].should.equal("0x01");
    bytes[1].should.equal("0x00");
    bytes[2].should.equal("0x00");
    bytes[3].should.equal("0x00");
  });
  it("Should convert hex and UInt16", () => {
    _.Utils.HexToUInt16("0x0000").should.equal(0);

    _.Utils.UInt16ToHex(0).should.equal("0x0000");

    _.Utils.HexToUInt16("0x0100").should.equal(1);

    _.Utils.UInt16ToHex(1).should.equal("0x0100");

    _.Utils.HexToUInt16("0x0200").should.equal(2);

    _.Utils.UInt16ToHex(2).should.equal("0x0200");
  });
  it("Should convert BN and Bytes32", () => {
    // Hex to BN
    _.Utils.Bytes32ToNumber("0x79e1468840812fd65f7c892a033e98ccf11478251773d657a1163ab2ce2e867b").toString().should.equal("55127882063740522599771039598867975169756756683277491833087143897347092547195"); // BN to Hex


    _.Utils.NumberToBytes32("55127882063740522599771039598867975169756756683277491833087143897347092547195").should.equal("0x79e1468840812fd65f7c892a033e98ccf11478251773d657a1163ab2ce2e867b");
  });
  it("Should convert base58 to BN", () => {
    _.Utils.UInt256ToBase58("537330421943210887287969141479910760414342485605255494634916276940614268621850235").should.equal("QmWYRGwxoy6vwEPVHxPkgoFd2EunPmkrsW4FgtpyuA41ii");

    _.Utils.Base58ToUInt256("QmWYRGwxoy6vwEPVHxPkgoFd2EunPmkrsW4FgtpyuA41ii").toString().should.equal("537330421943210887287969141479910760414342485605255494634916276940614268621850235");
  });
  it("Should convert ascii to bytes", () => {
    _.Utils.AsciiToBytes("http://infocorp.io/nft=123451111111111111111111111111111111111111111111111111119999999999999").should.equal("0x687474703a2f2f696e666f636f72702e696f2f6e66743d313233343531313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313131313139393939393939393939393939");
  });
  it("Should convert ascii to bytes32", () => {
    _.Utils.AsciiToBytes32("GalleryToken").should.equal("0x47616c6c657279546f6b656e0000000000000000000000000000000000000000");
  });
});