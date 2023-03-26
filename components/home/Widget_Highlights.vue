<!-- Widget: Highlights -->
<!-- Widget shows different collections choosen by specific parametrs -->
<!-- Wiki:  -->
<template>
    <div class="widget-row-1">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-highlights.svg">Highlights</div>
            </div>
            <div class="widget-content">
                <div v-if="isLoading" class="widget-content-placeholder"></div>
                <div v-else>
                    <router-link :to="`/collection/${collection_id}`">
                        <div class="collection">
                            <div class="collection-image" v-if="displayCollection && displayCollection.metadata">
                                <img :src="`${displayCollection.metadata.mediaUri}`" @error="handleImageError">
                            </div>
                            <div class="collection-data">
                                <div class="collection-name" v-if="displayCollection && displayCollection.metadata">
                                    {{ displayCollection.metadata.name }}
                                </div>
                                <div class="collection-creator" v-if="displayCollection">{{ displayCollection.currentOwner }}</div>
                                <div class="collection-creator" v-if="displayCollection">{{ displayCollection.symbol }}</div>
                                <div class="collection-description" v-if="displayCollection && displayCollection.metadata">
                                    {{ displayCollection.metadata.description }}
                                </div>
                            </div>
                            <div class="collection-social"></div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue';
import imgPlaceholder from '@/static/collection_placeholder.svg';

export default {
    name: 'Widget_Highlights',

    setup() {
        const collection = ref([]);
        const collection_id = ref(null)
        const isLoading = ref(false);
        const error = ref(null);

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

            const formattedMetadata = metadata ?
                { ...metadata, mediaUri: imageURL } :
                null;
            return { ...collection.value, currentOwner: formattedIssuer, metadata: formattedMetadata };
        });

        // Fetch highlights collection ids
        async function fetchHighlights() {
            try {
                const response = await fetch(`${config.api}/getHighlights`);
                const data = await response.json();
                collection_id.value = data.collection_id;
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = 'Failed to fetch collection';
            }
            await fetchCollection();
        }

        // Fetch collection information
        async function fetchCollection() {
            try {
                const response = await fetch(`${config.api}/getCollection/${collection_id.value}`);
                const data = await response.json();
                collection.value = data;
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = 'Failed to fetch collection';
            }
            isLoading.value = false;
        }

        // Replace broken image
        function handleImageError(event) {
            event.target.src = imgPlaceholder;
        }


        onMounted(async () => {
            isLoading.value = true;
            await fetchHighlights();
        });

        return {
            collection,
            collection_id,
            displayCollection,
            handleImageError,
            isLoading,
            error,
        };
    },
};
</script>