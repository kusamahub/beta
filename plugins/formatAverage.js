export default defineNuxtPlugin(nuxtApp => {

    function formatAverage(average) {
        return parseFloat(average).toFixed(2);
    }
    nuxtApp.formatAverage = formatAverage;
});