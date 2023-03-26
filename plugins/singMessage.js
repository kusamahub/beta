import { web3FromAddress } from "@polkadot/extension-dapp";

export default defineNuxtPlugin(nuxtApp => {

    async function signMessage(walletAddress, message) {
        try {
            const injector = await web3FromAddress(walletAddress);

            const { signature } = await injector.signer.signRaw({
                address: walletAddress,
                data: message,
                type: 'bytes',
            });

            return signature;
        } catch (error) {
            console.error('Signing canceled by user or an error occurred:', error);
            return null;
        }
    }
    nuxtApp.signMessage = signMessage;
});