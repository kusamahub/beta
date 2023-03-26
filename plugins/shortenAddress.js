export default defineNuxtPlugin(nuxtApp => {
    const shortenAddress = (longAddress) => {
        return longAddress.slice(0, 4) + '...' + longAddress.slice(-4)
    }

    nuxtApp.shortenAddress = shortenAddress
})