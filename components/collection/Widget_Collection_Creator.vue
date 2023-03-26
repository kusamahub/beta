<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><img src="@/static/images/icons/icon-creators.svg">Creator</div>
        </div>
        <div class="widget-content">
            <div v-if="isLoading" class="widget-content-placeholder"></div>
            <div v-else v-if="creator">
                <router-link :to="`/creator/${creator.longIssuer}`">
                    <div class="creator-collection">
                        <div class="creator-image">
                            <img :src="imgPlaceholder">
                        </div>
                        <div class="creator-data">
                            <div class="creator-username">{{ creator.name }}</div>
                            <div class="creator-address">{{ creator.shortIssuer }}</div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import imgPlaceholder from '@/static/creator_placeholder.svg';

export default {
    name: 'Widget_Collection_Creator',

    setup() {
        const creator = ref(null);
        const isLoading = ref(false);
        const error = ref(null);
        const route = useRoute();
        const config = useRuntimeConfig()

        async function fetchCreator() {
            try {
                const response = await fetch(`${config.api}/getCollectionCreator/${route.params.id}`);
                const data = await response.json();
                if (data.data_from === 'singular') {
                    creator.value = { currentOwner: data.collection_data.issuer };
                } else {
                    creator.value = { currentOwner: data.collection_data.currentOwner };
                }
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = 'Failed to fetch creator';
            }
        }

        async function fetchMetadataForCreator(creatorIssuer) {
            const metadataUrl = `${config.api}/getCreatorMetadata/${creatorIssuer}`;
            try {
                const response = await fetch(metadataUrl);
                const metadata = await response.json();
                return { currentOwner: creatorIssuer, metadata };
            } catch (e) {
                console.error(e);
                return { currentOwner: creatorIssuer, metadata: null };
            }
        }

        onMounted(async () => {
            isLoading.value = true;
            try {
                await fetchCreator();
                if (creator.value) {
                    const creatorWithMetadata = await fetchMetadataForCreator(creator.value.currentOwner);
                    const formattedIssuer = useNuxtApp().shortenAddress(creatorWithMetadata.currentOwner);
                    const metadata = creatorWithMetadata.metadata || null;
                    const name = metadata ? metadata.name : 'Creator';
                    const longIssuer = creatorWithMetadata.currentOwner;
                    creator.value = { ...creatorWithMetadata, shortIssuer: formattedIssuer, metadata, name, longIssuer };
                }
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = 'Failed to fetch creator';
            } finally {
                isLoading.value = false;
            }
        });

        return {
            creator,
            isLoading,
            error,
            imgPlaceholder
        };
    },
}
</script>