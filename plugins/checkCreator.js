export default defineNuxtPlugin(nuxtApp => {

    const config = useRuntimeConfig();

    async function checkCreator(walletAddress) {
        try {
            const response = await fetch(config.api + '/getCreators');
            const jsonData = await response.json();
            const creators = jsonData.creators;

            const isCreator = creators.some(
                (creator) => creator.issuer === walletAddress
            );

            return isCreator;
        } catch (error) {
            console.error('Error checking creator', error);
            return false;
        }
    }

    nuxtApp.checkCreator = checkCreator;
});