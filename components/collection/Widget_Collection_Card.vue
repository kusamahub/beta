<template>
    <div class="widget-row-1">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title">
                    <img src="@/static/images/icons/icon-projects.svg" alt="icon" />Collection
                </div>
                <div class="widget-buttons">
                    <div v-if="walletAddressComputed && isCreatorComputed && isCreatorCollection" class="widget-button" @click="showWindow"><span class="material-icons">edit</span></div>
                    <div v-if="walletAddressComputed" class="widget-button" :class="{'favorite-added': isFavoriteAdded}" @click="favorite"><span class="material-icons">favorite</span></div>
                </div>
            </div>
            <div class="widget-content">
                <div v-if="isLoading" class="widget-content-placeholder"></div>
                <div v-else class="collection">
                    <div class="collection-image" v-if="displayCollection && displayCollection.metadata">
                        <img :src="`${displayCollection.metadata.mediaUri}`" @error="handleImageError">
                    </div>
                    <div class="collection-data">
                        <div class="collection-name" v-if="displayCollection && displayCollection.metadata">
                            {{ displayCollection.metadata.name }}
                        </div>
                        <div class="collection-creator" v-if="displayCollection">{{ displayCollection.currentOwner }}</div>
                        <div class="collection-description" v-if="displayCollection && displayCollection.metadata">
                            {{ displayCollection.metadata.description }}
                        </div>
                        <div class="collection-social" v-if="collectionTwitter || collectionDiscord || collectionTelegram || collectionWebsite">
                            <div class="collection-social-block" v-if="collectionTwitter">
                                <a :href="collectionTwitter" target="_blank">
                                    <div class="collection-social-icon"><img src="@/static/images/icons/icon-twitter.svg"></div>
                                    <div class="collection-social-name">Twitter</div>
                                </a>
                            </div>
                            <div class="collection-social-block" v-if="collectionDiscord">
                                <a :href="collectionDiscord" target="_blank">
                                    <div class="collection-social-icon"><img src="@/static/images/icons/icon-discord.svg"></div>
                                    <div class="collection-social-name">Discord</div>
                                </a>
                            </div>
                            <div class="collection-social-block" v-if="collectionTelegram">
                                <a :href="collectionTelegram" target="_blank">
                                    <div class="collection-social-icon"><img src="@/static/images/icons/icon-telegram.svg"></div>
                                    <div class="collection-social-name">Telegram</div>
                                </a>
                            </div>
                            <div class="collection-social-block" v-if="collectionWebsite">
                                <a :href="collectionWebsite" target="_blank">
                                    <div class="collection-social-icon"><img src="@/static/images/icons/icon-web.svg"></div>
                                    <div class="collection-social-name">Website</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Add Review Window -->
    <div class="app-window-background" ref="appWindowBackground" v-if="updateSocialStart" @click="closeWindow">
        <div class="app-window" @click.stop>
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-projects.svg">Change data</div>
                <div @click="updateSocialStart = false" class="widget-button"><span class="material-icons">close</span></div>
            </div>
            <div class="widget-content widget-scrollable-window">
                <div v-if="windowStatus === 'idle'">
                    <div class="window-content">
                        <div class="window-content-symbol">🌐</div>
                        <div class="window-content-title">Change data</div>
                        <div class="window-content-text">
                            You can update collection data to show more info about your collection<br>
                            <div v-if="twitterUrlErr" class="window-error-msg">Twitter must contain https://twitter.com/</div>
                            <div v-if="discordUrlErr" class="window-error-msg">Discord must contain https://discord.com/</div>
                            <div v-if="telegramUrlErr" class="window-error-msg">Telegram must contain https://telegram.com/ or https://t.me/</div>
                            <div v-if="websiteUrlErr" class="window-error-msg">Website must contain https://</div>
                            <div v-if="cancelSignMsg" class="window-error-msg">You need to sign transaction for update collection data</div>
                        </div>
                    </div>
                    <div>
                        <input id="twitter_field" placeholder="Twitter">
                        <input id="discord_field" placeholder="Discord">
                        <input id="telegram_field" placeholder="Telegram">
                        <input id="website_field" placeholder="Website">
                    </div>
                    <div>
                        <div :class="{'window-button': true, 'disabled': isSubmitting}" @click="editSocial" :disabled="isSubmitting">Update</div>
                    </div>
                </div>
                <div v-if="windowStatus === 'error'">
                    <div class="window-content">
                        <div class="window-content-symbol">❌</div>
                        <div class="window-content-title">You catch error</div>
                        <div class="window-content-text">
                            Something went wrong. Please, contact support<br>
                            <div class="email-link">feedback@kusamahub.com</div>
                        </div>
                    </div>
                    <div>
                        <div class="window-button" tabindex="0" @click="closeWindow">Close</div>
                    </div>
                </div>
                <div v-if="windowStatus === 'complete'">
                    <div class="window-content">
                        <div class="window-content-symbol">✅</div>
                        <div class="window-content-title">Data updated!</div>
                        <div class="window-content-text">
                            Window will close after 4 seconds<br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import imgPlaceholder from '@/static/collection_placeholder.svg';

export default {
    name: 'Widget_Collection_Card',

    setup() {
        const route = useRoute();
        const collection = ref([]);
        const isLoading = ref(false);
        const error = ref(null);

        const walletAddress = ref(localStorage.getItem('user_wallet') || '');
        const walletName = ref(localStorage.getItem('user_name') || '');
        const isCreator = ref(localStorage.getItem('is_creator') === 'true');
        const isCreatorComputed = computed(() => isCreator.value);
        const isCreatorCollection = ref(false);
        const walletAddressComputed = computed(() => walletAddress.value);
        const itemType = ref('');

        const isFavoriteAdded = ref(false);


        const appWindowBackground = ref(null);
        const updateSocialStart = ref(false);
        const windowStatus = ref('idle');
        const showSymbolLimitError = ref(false);
        const cancelSignMsg = ref(false);
        const twitterUrlErr = ref(false);
        const discordUrlErr = ref(false);
        const telegramUrlErr = ref(false);
        const websiteUrlErr = ref(false);
        const isSubmitting = ref(false);
        const getUserReviewText = ref('');
        const collectionTwitter = ref('');
        const collectionDiscord = ref('');
        const collectionTelegram = ref('');
        const collectionWebsite = ref('');


        const config = useRuntimeConfig();

        // Display data in template
        const displayCollection = computed(() => {
            if (!collection.value || collection.value.length === 0) {
                return null;
            }

            let formattedIssuer = '';

            if (collection.value.data_from === 'singular') {
                formattedIssuer = collection.value.collection_data.issuer ?
                    useNuxtApp().shortenAddress(collection.value.collection_data.issuer) :
                    'Creator';
            } else {
                formattedIssuer = collection.value.collection_data.currentOwner ?
                    useNuxtApp().shortenAddress(collection.value.collection_data.currentOwner) :
                    'Creator';
            }

            const metadata = collection.value.collection_meta || null;
            let imageURL;

            if (metadata) {
                if (metadata.mediaUri) {
                    imageURL = useNuxtApp().getImage(metadata.mediaUri);
                } else if (metadata.image) {
                    imageURL = useNuxtApp().getImage(metadata.image);
                } else {
                    const keys = Object.keys(metadata);
                    const imageKey = keys.find((key) => {
                        const value = metadata[key];
                        return (
                            typeof value === 'object' &&
                            value !== null &&
                            typeof value.description === 'string' &&
                            value.description.startsWith('ipfs://')
                        );
                    });
                    imageURL = imageKey ? useNuxtApp().getImage(metadata[imageKey].description) : '';
                }
            }

            const formattedMetadata = metadata ? { ...metadata, mediaUri: imageURL } :
                null;
            return { ...collection.value, currentOwner: formattedIssuer, metadata: formattedMetadata };
        });


        async function fetchCollectionSocial() {
            try {
                const response = await fetch(`${config.api}/getCollectionSocial/${route.params.id}`);
                const data = await response.json();
                if (data.length > 0) {
                    collectionTwitter.value = data[0].collection_twitter || '';
                    collectionDiscord.value = data[0].collection_discord || '';
                    collectionTelegram.value = data[0].collection_telegram || '';
                    collectionWebsite.value = data[0].collection_website || '';
                }
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = 'Failed to fetch collection';
            }
        }


        // Fetch collection information
        async function fetchCollection() {
            try {
                const response = await fetch(`${config.api}/getCollection/${route.params.id}`);
                const data = await response.json();
                collection.value = data;
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = 'Failed to fetch collection';
            }
            isLoading.value = false;
        }

        function handleImageError(event) {
            event.target.src = imgPlaceholder;
        }



        function checkTypePage() {
            const currentPath = route.path;
            const pathParts = currentPath.split('/');
            const firstPart = pathParts[1];

            if (firstPart === 'collection') {
                itemType.value = 'collection';
                return 'collection';
            } else if (firstPart === 'creator') {
                itemType.value = 'creator';
                return 'creator';
            }
        }



        // Add favorite

        async function getUserFavorite() {
            try {
                const pageType = checkTypePage();
                const response = await fetch(`${config.api}/getUserFavoriteItem/${walletAddress.value}/${route.params.id}`);
                const data = await response.json();

                if (data && data.length > 0 && data[0].item_type) {
                    if (data[0].item_type === 'collection' && pageType === 'collection') {
                        isFavoriteAdded.value = true;
                    }

                    if (data[0].item_type === 'creator' && pageType === 'creator') {
                        isFavoriteAdded.value = true;
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user favorite:', error);
            }
        }




        // Favorite
        async function favorite() {
            await checkConnection();

            if (!walletAddress.value) {
                alert('Please, login');
                return;
            }

            const signedResult = await signMessage();
            if (!signedResult) {
                return;
            }

            await updateFavorite();
        }




        // Update collection social
        async function editSocial() {
            const userEnteredData = {
                twitter: document.getElementById('twitter_field').value.trim(),
                discord: document.getElementById('discord_field').value.trim(),
                telegram: document.getElementById('telegram_field').value.trim(),
                website: document.getElementById('website_field').value.trim(),
            };

            if (isSubmitting.value) return;

            if (userEnteredData.twitter && !validateTwitter(userEnteredData.twitter)) {
                twitterUrlErr.value = true;
                setTimeout(() => {
                    twitterUrlErr.value = false;
                }, 4000);
                return;
            }

            if (userEnteredData.discord && !validateDiscord(userEnteredData.discord)) {
                discordUrlErr.value = true;
                setTimeout(() => {
                    discordUrlErr.value = false;
                }, 4000);
                return;
            }

            if (userEnteredData.telegram && !validateTelegram(userEnteredData.telegram)) {
                telegramUrlErr.value = true;
                setTimeout(() => {
                    telegramUrlErr.value = false;
                }, 4000);
                return;
            }

            if (userEnteredData.website && !validateWebsite(userEnteredData.website)) {
                websiteUrlErr.value = true;
                setTimeout(() => {
                    websiteUrlErr.value = false;
                }, 4000);
                return;
            }

            function validateTwitter(url) {
                return url.startsWith('https://twitter.com/');
            }

            function validateDiscord(url) {
                return url.startsWith('https://discord.com/') || url.startsWith('https://discord.gg/');
            }

            function validateTelegram(url) {
                return url.startsWith('https://telegram.com/') || url.startsWith('https://t.me/');
            }

            function validateWebsite(url) {
                return url.startsWith('https://');
            }

            isSubmitting.value = true;
            showSymbolLimitError.value = false;

            await checkConnection();
            if (!walletAddressComputed.value) {
                alert('Please, login');
                isSubmitting.value = false;
                closeWindow();
                return;
            }

            await checkCreatorCollections();
            if (!isCreatorCollection.value) {
                alert("You can't update info for this collection");
                isSubmitting.value = false;
                closeWindow();
                return;
            }


            const signedResult = await signMessage();
            if (!signedResult) {
                windowStatus.value = 'idle';
                cancelSignMsg.value = true;
                setTimeout(() => {
                    cancelSignMsg.value = false;
                }, 4000);
                isSubmitting.value = false;
                return;
            }

            const success = await updateCollectionSocial(userEnteredData);
            if (success) {
                windowStatus.value = 'complete';
                setTimeout(() => {
                    location.reload()
                }, 4000);
            } else {
                windowStatus.value = 'error';
            }

            isSubmitting.value = false;
        }







        // Check wallet connection
        async function checkConnection() {
            try {
                const isConnected = await nuxtApp.checkConnect();
                if (!isConnected) {
                    localStorage.removeItem('user_wallet');
                    localStorage.removeItem('user_name');
                    walletAddress.value = '';
                    localStorage.removeItem('is_creator');
                }
            } catch (error) {
                console.error('Failed to check connection:', error);
            }
        }





        // Sign message for access API
        async function signMessage() {
            try {
                const message = 'To update data you need to sign message';
                const signedResult = await nuxtApp.signMessage(walletAddress.value, message);

                if (!signedResult) {
                    return false;
                }

                const methodBody = {
                    walletAddress: walletAddress.value,
                    signedMessage: signedResult,
                    message: message,
                };

                const response = await fetch(config.api + '/api/generateToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(methodBody),
                });

                if (response.ok) {
                    const data = await response.json();
                    const token = data.token;
                    localStorage.setItem('auth_token', token);
                } else {
                    console.error('Failed to generate JWT token. Server response:', await response.text());
                }

                return true;
            } catch (error) {
                alert(error.message);
                return false;
            }
        }


        // Handle add to favorite
        async function updateFavorite() {
            try {
                const authToken = localStorage.getItem('auth_token');
                const response = await fetch(`${config.api}/updateUserFavorites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        user_id: walletAddress.value,
                        item_id: route.params.id,
                        item_type: itemType.value,
                    }),
                });

                if (response.ok) {
                    localStorage.removeItem('auth_token');
                    location.reload()
                } else {
                    console.error('Failed to update user rating. Server response:', await response.text());
                }
            } catch (error) {
                console.error('Failed to update user rating:', error);
            }
        }


        // Handle update collection data
        async function updateCollectionSocial(userEnteredData) {
            try {
                const authToken = localStorage.getItem('auth_token');
                const response = await fetch(`${config.api}/updateCollectionSocial`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        collection_id: route.params.id,
                        collection_twitter: userEnteredData.twitter,
                        collection_discord: userEnteredData.discord,
                        collection_telegram: userEnteredData.telegram,
                        collection_website: userEnteredData.website,
                    }),
                });

                if (response.ok) {
                    localStorage.removeItem('auth_token');
                    return true;
                } else {
                    console.error('Failed to update user rating. Server response:', await response.text());
                    return false;
                }
            } catch (error) {
                console.error('Failed to update user rating:', error);
                return false;
            }
        }






        const nuxtApp = useNuxtApp();
        const checkCreator = async () => {
            const storedWalletAddress = localStorage.getItem('user_wallet');
            if (storedWalletAddress) {
                const isConnected = await nuxtApp.checkConnect();
                if (!isConnected) {
                    localStorage.removeItem('user_wallet');
                    localStorage.removeItem('user_name');
                    walletAddress.value = '';
                    walletName.value = '';
                    localStorage.removeItem('is_creator');
                    isCreator.value = false;
                } else {
                    const creatorStatus = await nuxtApp.checkCreator(walletAddress.value);
                    isCreator.value = creatorStatus;
                    localStorage.setItem('is_creator', creatorStatus);
                }
            } else {

            }
        };

        async function checkCreatorCollections() {
            try {

                const response = await fetch(`${config.api}/getCreatorCollectionsIds/${walletAddress.value}`);
                const data = await response.json();

                if (data && data.collections) {
                    const found = data.collections.some((collection) => collection.id === route.params.id);
                    isCreatorCollection.value = found;
                }
            } catch (error) {
                console.error('Failed to fetch creator collections:', error);
            }
        }


        // Modal functions:

        function showWindow() {
            if (!isCreatorCollection.value) {
                alert("You can't edit data for this collection");
                return;
            }
            updateSocialStart.value = true;
        }

        function closeWindow() {
            updateSocialStart.value = false;
        }

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeWindow();
            }
        };

        const onClick = (event) => {
            if (event.target.classList.contains('app-window-background')) {
                closeWindow();
            }
        };



        onMounted(async () => {
            isLoading.value = true;

            if (walletAddress.value) {
                await getUserFavorite();
            }

            await fetchCollection();

            if (walletAddress.value) {
                await checkCreator();
            }

            if (walletAddress.value) {
                await checkCreatorCollections();
            }

            fetchCollectionSocial();

            document.addEventListener('keydown', onKeyDown);
        });

        watch(walletAddress, async () => {
            await checkCreatorCollections();
        });

        return {
            collection,
            displayCollection,
            handleImageError,
            isCreatorComputed,
            isCreatorCollection,
            walletAddressComputed,
            isLoading,
            error,
            isFavoriteAdded,
            favorite,
            editSocial,
            appWindowBackground,
            showWindow,
            closeWindow,
            isSubmitting,
            updateSocialStart,
            windowStatus,
            editSocial,
            twitterUrlErr,
            discordUrlErr,
            telegramUrlErr,
            websiteUrlErr,
            cancelSignMsg,
            collectionTwitter,
            collectionDiscord,
            collectionTelegram,
            collectionWebsite,
        };
    },
};
</script>