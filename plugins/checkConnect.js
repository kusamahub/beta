import { web3Enable } from "@polkadot/extension-dapp";

export default defineNuxtPlugin(nuxtApp => {
    async function checkConnect() {
        const extensions = await web3Enable("KusamaHub");
        if (!extensions.length) {
            return false
        }
        return true;
    }

    nuxtApp.checkConnect = checkConnect;
});