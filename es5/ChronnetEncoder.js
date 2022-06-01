"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Utils = require("./Utils");

var _ChronnetConstants = require("./ChronnetConstants");

class ChronnetEncoder {
  static EncodeAddressId(networkId, addr) {
    if (typeof networkId != "number") throw Error("NetworkId must be a number");
    let versionId = "01";

    let networkIdHex = _Utils.UInt16ToHex(networkId).slice(2);

    let len = (addr.slice(2).length / 2).toString(16);

    let addrBytes = _Utils.RightPad(addr.toLowerCase(), 56).slice(2);

    return "0x" + versionId + networkIdHex + len + addrBytes;
  }

  static DecodePackageId(packageId) {
    packageId = packageId.slice(2);
    return {
      tokenId: "0x" + packageId.substr(0, 48),
      nonce: "0x" + packageId.slice(48)
    };
  }

  static EncodePackageHeader(originatorId, recipientId, tokenId, packageType, packageVersion, packageNonce, data) {
    let pkg = "0x" + originatorId.slice(2) + // 32 b
    recipientId.slice(2) + // 32 b
    tokenId.slice(2) + // 32 b
    packageType.slice(2) + // 1  b
    packageVersion.slice(2) + // 1  b
    packageNonce.slice(2) + // 8  b
    _ChronnetConstants.PACKAGE_MAGIC.slice(2) + // 4  b
    data.slice(2); // 18 b

    return pkg;
  }

  static DecodePackageHeader(pkg) {
    const slotsize = 64;
    let pkgBytes = pkg.slice(2);
    return {
      originatorId: "0x" + pkgBytes.substr(0, slotsize),
      recipientId: "0x" + pkgBytes.substr(slotsize, slotsize),
      tokenId: "0x" + pkgBytes.substr(2 * slotsize, slotsize),
      packageType: "0x" + pkgBytes.substr(3 * slotsize, 2),
      packageVersion: "0x" + pkgBytes.substr(3 * slotsize + 2, 2),
      packageNonce: pkgBytes.substr(3 * slotsize + 4, 16),
      magicNumber: "0x" + pkgBytes.substr(3 * slotsize + 20, 8),
      data: "0x" + pkgBytes.substr(3 * slotsize + 28, 36)
    };
  }

  static EncodeErc20Package(originatorId, recipientId, tokenId, packageType, packageVersion, packageNonce, data, tokenQty) {
    const pkg = "0x" + originatorId.slice(2) + // 32 b
    recipientId.slice(2) + // 32 b
    tokenId.slice(2) + // 32 b
    packageType.slice(2) + // 1  b
    packageVersion.slice(2) + // 1  b
    packageNonce.slice(2) + // 8  b
    _ChronnetConstants.PACKAGE_MAGIC.slice(2) + // 4  b
    data.slice(2) + // 18 b
    _Utils.NumberToBytes32(tokenQty).slice(2); // 32 b


    return pkg;
  }

  static DecodeErc20Package(pkg) {
    const slotsize = 64;
    let pkgBytes = pkg.slice(2);
    return {
      originatorId: "0x" + pkgBytes.substr(0, slotsize),
      recipientId: "0x" + pkgBytes.substr(slotsize, slotsize),
      tokenId: "0x" + pkgBytes.substr(2 * slotsize, slotsize),
      packageType: "0x" + pkgBytes.substr(3 * slotsize, 2),
      packageVersion: "0x" + pkgBytes.substr(3 * slotsize + 2, 2),
      packageNonce: pkgBytes.substr(3 * slotsize + 4, 16),
      magicNumber: "0x" + pkgBytes.substr(3 * slotsize + 20, 8),
      data: "0x" + pkgBytes.substr(3 * slotsize + 28, 36),
      tokenQty: _Utils.Bytes32ToNumber("0x" + pkgBytes.substr(4 * slotsize))
    };
  }

  static EncodeErc721Package(originatorId, recipientId, tokenId, packageType, packageVersion, packageNonce, data, nftTokenId, tokenUri) {
    const pkg = "0x" + originatorId.slice(2) + // 32 b
    recipientId.slice(2) + // 32 b
    tokenId.slice(2) + // 32 b
    packageType.slice(2) + // 1  b
    packageVersion.slice(2) + // 1  b
    packageNonce.slice(2) + // 8  b
    _ChronnetConstants.PACKAGE_MAGIC.slice(2) + // 4  b
    data.slice(2) + // 18 b
    _Utils.NumberToBytes32(nftTokenId).slice(2) + _Utils.AsciiToBytes(tokenUri).slice(2);

    return pkg;
  }

  static DecodeErc721Package(pkg) {
    const slotsize = 64;
    let pkgBytes = pkg.slice(2);
    return {
      originatorId: "0x" + pkgBytes.substr(0, slotsize),
      recipientId: "0x" + pkgBytes.substr(slotsize, slotsize),
      tokenId: "0x" + pkgBytes.substr(2 * slotsize, slotsize),
      packageType: "0x" + pkgBytes.substr(3 * slotsize, 2),
      packageVersion: "0x" + pkgBytes.substr(3 * slotsize + 2, 2),
      packageNonce: pkgBytes.substr(3 * slotsize + 4, 16),
      magicNumber: "0x" + pkgBytes.substr(3 * slotsize + 20, 8),
      data: "0x" + pkgBytes.substr(3 * slotsize + 28, 36),
      nftTokenId: _Utils.Bytes32ToNumber("0x" + pkgBytes.substr(4 * slotsize, slotsize)),
      tokenUri: _Utils.BytesToAscii(_Utils.ToBytes("0x" + pkgBytes.substr(5 * slotsize)))
    };
  }

}

var _default = ChronnetEncoder;
exports.default = _default;
module.exports = exports.default;