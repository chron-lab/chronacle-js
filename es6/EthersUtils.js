import { ethers, Wallet } from "ethers";

class EthersUtils {
    // SIGNATURE-----------------------------------------------------------------------

    static async SignMessage(ptekey, message) {
        let wallet = new Wallet(ptekey);
        let hash = ethers.utils.keccak256(message);
        let signature = await wallet.signMessage(ethers.utils.arrayify(hash));
        return signature;
    }

    /* Pack array of 65 bytes signatures into a single array */
    static PackSignatures(signatures) {
        let result = "";
        signatures.forEach((s) => {
            result = `${result}${s.slice(2)}`;
        });
        return `0x${result}`;
    }
}

export default EthersUtils;
