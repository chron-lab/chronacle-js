import { encode, decode } from "base58-universal";
import { ethers } from "ethers";
const { importer } = require("ipfs-unixfs-importer");

class Utils {
    static AsciiToBytes32 = (ascii) => {
        if (ascii.length > 32) throw new Error("String exceeded 32 char.");
        let s = "0x";
        for (let i = 0; i < 32; i++) {
            const char = ascii.charCodeAt(i);
            s += char ? char.toString(16) : "00";
        }
        return s;
    };

    static AsciiToBytes = (str) => {
        var arr1 = [];
        for (var n = 0, l = str.length; n < l; n++) {
            var hex = Number(str.charCodeAt(n)).toString(16);
            arr1.push(hex);
        }
        return "0x" + arr1.join("");
    };

    static Bytes32ToAscii = (bytes32) => {
        let s = "";
        if (bytes32.length != 32) throw new Error("Not bytes32.");
        for (let i = 0; i < 32; i++) {
            if (bytes32[i] > 0) s += String.fromCharCode(bytes32[i]);
        }
        return s;
    };

    static BytesToAscii = (bytes) => {
        let s = "";
        for (let i = 0; i < bytes.length; i++) {
            if (bytes[i] > 0) s += String.fromCharCode(bytes[i]);
        }
        return s;
    };

    static ToHex = (bytes) => {
        if (bytes)
            return (
                "0x" +
                bytes.reduce(
                    (output, elem) =>
                        output + ("0" + elem.toString(16)).slice(-2),
                    ""
                )
            );
    };

    static ToBytes = (hex) => {
        if (hex.startsWith("0x")) hex = hex.slice(2);
        return new Uint8Array(
            hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
        );
    };

    static UInt16ToBytes = (num) => {
        if (typeof num != "number") throw new Error("Input is not a number");

        const uint16 = new Uint16Array([num]);
        return new Uint8Array(
            uint16.buffer,
            uint16.byteOffset,
            uint16.byteLength
        );
    };

    static UInt16ToHex = (num) => {
        if (typeof num != "number") throw new Error("Input is not a number");
        const bytes = Utils.UInt16ToBytes(num);
        return Utils.ToHex(bytes);
    };

    static BytesToUInt16 = (bytes) => {
        if (bytes.length != 2) throw new Error("Byte array length must be 2");
        return parseInt(bytes);
    };

    static HexToUInt16 = (hex) => {
        const bytes = Utils.ToBytes(hex);
        if (bytes.length != 2) throw new Error("Byte array length must be 2");
        return Utils.BytesToUInt16(bytes);
    };

    static HexToBase64 = (str) => {
        return btoa(
            String.fromCharCode.apply(
                null,
                str
                    .replace(/\r|\n/g, "")
                    .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
                    .replace(/ +$/, "")
                    .split(" ")
            )
        );
    };

    static Base64ToHex = (base64) => {
        const raw = atob(base64);
        let result = "";
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += hex.length === 2 ? hex : "0" + hex;
        }
        return result.toLowerCase();
    };

    static Base58ToHex = (base58) => {
        return Utils.ToHex(decode(base58));
    };

    static Base58ToUInt256 = (base58) => {
        const hex = Utils.Base58ToHex(base58);
        return ethers.BigNumber.from(hex);
    };

    static UInt256ToBase58 = (uint256) => {
        const hex = ethers.BigNumber.from(uint256.toString()).toHexString();
        return Utils.HexToBase58(hex);
    };

    static HexToBase58 = (hex) => {
        return encode(Utils.ToBytes(hex));
    };

    static Awaitable = async (fun) => {
        if (fun.on)
            return await fun.on("receipt", (receipt) => {
                //console.log(receipt)
            });
        return fun;
    };

    static Delay = (ms) => {
        return new Promise((res) => setTimeout(res, ms));
    };

    static Promisify = (fun, params = []) => {
        return new Promise((resolve, reject) => {
            fun(...params, (err, data) => {
                if (err !== null) reject(err);
                else resolve(data);
            });
        });
    };

    static MapToObj = (m) => {
        return Array.from(m).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    };

    static StringifyReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return;
                }
                seen.add(value);
            }
            return value;
        };
    };

    /**
     * Should be called to pad string to expected length
     *
     * @method RightPad
     * @param {String} string to be padded
     * @param {Number} chars that result string should have
     * @param {String} sign, by default 0
     * @returns {String} right aligned string
     */
    static RightPad = (string, chars, sign) => {
        var hasPrefix = /^0x/i.test(string) || typeof string === "number";
        string = string.toString(16).replace(/^0x/i, "");

        var padding =
            chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;

        return (
            (hasPrefix ? "0x" : "") +
            string +
            new Array(padding).join(sign ? sign : "0")
        );
    };

    /**
     * Should be called to pad string to expected length
     *
     * @method LeftPad
     * @param {String} string to be padded
     * @param {Number} chars that result string should have
     * @param {String} sign, by default 0
     * @returns {String} right aligned string
     */
    static LeftPad = (string, chars, sign) => {
        var hasPrefix = /^0x/i.test(string) || typeof string === "number";
        string = string.toString(16).replace(/^0x/i, "");

        var padding =
            chars - string.length + 1 >= 0 ? chars - string.length + 1 : 0;

        return (
            (hasPrefix ? "0x" : "") +
            new Array(padding).join(sign ? sign : "0") +
            string
        );
    };

    static NumberToBytes8 = (number) => {
        return Utils.LeftPad(number, 16);
    };

    static NumberToBytes32 = (uint256) => {
        const hex = ethers.BigNumber.from(uint256.toString()).toHexString();
        return Utils.LeftPad(hex, 64);
    };

    static Bytes32ToNumber = (bytes32) => {
        return ethers.BigNumber.from(bytes32);
    };

    static CreatePoller = (interval, initialDelay) => {
        let timeoutId = null;
        let poller = () => {};
        return (fn) => {
            clearTimeout(timeoutId);
            poller = () => {
                timeoutId = setTimeout(poller, interval);
                return fn();
            };
            if (initialDelay) {
                return (timeoutId = setTimeout(poller, interval));
            }
            return poller();
        };
    };

    static CopyToClipboard = (e) => {
        const content = e.target.value;
        console.log("CopyToClipboard:", content);
        const el = document.createElement("textarea");
        el.value = content;
        document.body.appendChild(el);

        var selection = document.getSelection();
        var range = document.createRange();
        range.selectNode(el);
        selection.removeAllRanges();
        selection.addRange(range);

        document.execCommand("copy");
        document.body.removeChild(el);
    };

    static ipfsHash = async (content, options) => {
        const block = {
            get: async (cid) => {
                throw new Error(`unexpected block API get for ${cid}`);
            },
            put: async () => {
                throw new Error("unexpected block API put");
            },
        };

        options = options || {};
        options.onlyHash = true;

        if (typeof content === "string") {
            content = new TextEncoder().encode(content);
        }

        let lastCid;
        for await (const { cid } of importer([{ content }], block, options)) {
            lastCid = cid;
        }

        return `${lastCid}`;
    };
}

export default Utils;
