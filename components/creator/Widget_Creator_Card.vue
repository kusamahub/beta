<!-- Widget: Creator Card -->
<!-- Contains base creator information -->
<!-- Wiki:  -->
<template>
    <div class="widget-row-1">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-creators.svg">Creator</div>
                <div class="widget-buttons">
                    <div v-if="walletAddressComputed" class="widget-button" :class="{'favorite-added': isFavoriteAdded}" @click="favorite"><span class="material-icons">favorite</span></div>
                </div>
            </div>
            <div class="widget-content">
                <div v-if="isLoading" class="widget-content-placeholder"></div>
                <div v-else v-if="creator" class="creator">
                    <div class="creator-image">
                        <img :src="imgPlaceholder">
                    </div>
                    <div class="creator-data">
                        <div class="creator-name">{{ creator.name || route.params.id }}</div>
                        <div class="creator-creator">{{ creator.shortIssuer }}</div>
                        <div class="creator-description"></div>
                    </div>
                    <div class="creator-social"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import imgPlaceholder from '@/static/creator_placeholder.svg';

export default {
    name: 'Widget_Creator_Card',

    setup() {
        const creator = ref(null);
        const isLoading = ref(false);
        const error = ref(null);
        const route = useRoute();

        const walletAddress = ref(localStorage.getItem('user_wallet') || '');
        const walletName = ref(localStorage.getItem('user_name') || '');
        const isCreator = ref(localStorage.getItem('is_creator') === 'true');
        const isCreatorComputed = computed(() => isCreator.value);
        const walletAddressComputed = computed(() => walletAddress.value);

        const itemType = ref('');

        const isFavoriteAdded = ref(false);

        const config = useRuntimeConfig();



        const isCreatorPage = computed(() => {
            return walletAddressComputed.value && route.params.id === walletAddressComputed.value;
        });

        async function fetchCreator() {
            try {
                const response = await fetch(`${useRuntimeConfig().api}/getCreatorMetadata/${route.params.id}`);
                const metadata = await response.json();
                return { currentOwner: metadata.address, name: metadata.name };
            } catch (e) {
                console.error(e);
                return { currentOwner: null, metadata: null };
            }
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





        onMounted(async () => {
            isLoading.value = true;
            try {
                const creatorData = await fetchCreator();
                if (creatorData.currentOwner) {
                    const shortIssuer = useNuxtApp().shortenAddress(creatorData.currentOwner);
                    creator.value = { ...creatorData, shortIssuer };
                }
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = 'Failed to fetch creator';
            } finally {
                isLoading.value = false;
            }

            if (walletAddress.value) {
                await getUserFavorite();
            }

            await checkCreator();
        });


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



        return {
            creator,
            isLoading,
            error,
            imgPlaceholder,
            isCreatorComputed,
            walletAddressComputed,
            isCreatorPage,
            route,
            isFavoriteAdded,
            favorite
        };
    },
}
</script>