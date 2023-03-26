export default defineNuxtPlugin(nuxtApp => {
    const getImage = (url) => {
        if (!url || typeof url !== 'string') return null;

        const protocol = 'ipfs://';
        if (!url.startsWith(protocol)) {
            return url;
        }

        const cid = url.replace(protocol, '');
        const imageUrl = `https://ipfs.io/${cid}`;
        return imageUrl;
    }

    nuxtApp.getImage = getImage;
});