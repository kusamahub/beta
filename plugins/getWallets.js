import { web3Accounts, web3Enable, isWeb3Injected } from "@polkadot/extension-dapp";
import { encodeAddress } from '@polkadot/keyring';

export default defineNuxtPlugin(nuxtApp => {

    async function getWallets() {
        const extensions = await web3Enable("KusamaHub");
        if (!extensions.length) {
            throw new Error("Polkadot wallet extension is not installed.");
        }

        const allAccounts = await web3Accounts();
        if (!allAccounts.length) {
            throw new Error("No account found in the Polkadot wallet.");
        }

        const accounts = allAccounts.map(account => ({
            walletAddress: encodeAddress(account.address, 2),
            walletName: account.meta.name
        }));

        return accounts;
    }

    nuxtApp.getWallets = getWallets;
});