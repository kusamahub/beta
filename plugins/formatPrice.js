export default defineNuxtPlugin(nuxtApp => {

    function formatPrice(planck) {
        const KSM_DECIMALS = 12;
        const divisor = 10n ** BigInt(KSM_DECIMALS);
        const KSM = BigInt(planck) * 10n ** BigInt(1) / divisor;
        return Number(KSM) / 10;
    }

    nuxtApp.formatPrice = formatPrice;
});