<!-- Page: Collections -->
<!-- All collections page -->
<!-- Wiki:  -->
<template>
    <div>
        <Main_Header />
        <div class="content">
            <div class="widget-row-1">
                <div class="widget">
                    <div class="widget-header">
                        <div class="widget-title"><img src="@/static/images/icons/icon-projects.svg">Collections</div>
                    </div>
                    <div class="widget-content">
                        <div v-if="isLoading" class="widget-content-placeholder"></div>
                        <div v-else class="coneten">
                            <div class="projects-grid">
                                <div class="project-card" v-for="collection in displayedCollections" :key="collection.id">
                                    <router-link :to="`/collection/${collection.id}`">
                                        <div class="project-card-image">
                                            <img :src="`${collection.metadata.mediaUri}`" @error="handleImageError">
                                        </div>
                                        <div class="project-card-name">{{ collection.metadata_name }} </div>
                                        <div class="project-card-creators">{{ collection.issuer }}</div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="widget-page-switch">
                                <button class="widget-page-number" @click="previousPage" :disabled="currentPage === 1">Previous</button>
                                <button class="widget-page-number" @click="nextPage" :disabled="currentPage === totalPages">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Widget_Feedback />
        </div>
        <Main_Footer />
    </div>
</template>
<script>
import Main_Header from '~/components/header/Main_Header.vue';
import Main_Footer from '~/components/footer/Main_Footer.vue';
import Widget_Feedback from '~/components/feedback/Widget_Feedback.vue';
import { ref, computed, onMounted, watch } from 'vue';

import imgPlaceholder from '@/static/collection_placeholder.svg';

const config = useRuntimeConfig()

export default {

    components: { Main_Header, Main_Footer, Widget_Feedback },
    name: 'Collections',

    setup() {
        const collections = ref([]);
        const currentPage = ref(1);
        const itemsPerPage = 10;
        const isLoading = ref(false);
        const error = ref(null);


        const totalPages = computed(() => {
            return Math.ceil(collections.value.length / itemsPerPage);
        });

        const displayedCollections = computed(() => {
            const startIndex = (currentPage.value - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return collections.value.slice(startIndex, endIndex).map((collection) => {
                const formattedIssuer = useNuxtApp().shortenAddress(collection.issuer);
                const metadata = collection.metadata || null;
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

                return { ...collection, issuer: formattedIssuer, metadata: formattedMetadata };
            });
        });

        async function fetchCollections() {
            isLoading.value = true;
            try {
                const response = await fetch(`${config.api}/getCollections`);
                const data = await response.json();
                collections.value = data.collections;
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = 'Failed to fetch collections';
            }
            isLoading.value = false;
        }

        async function fetchMetadataForCollections(collections, startIndex, endIndex) {
            const subset = collections.slice(startIndex, endIndex);
            const promises = subset.map(async (collection) => {
                const collectionId = collection.id;
                const metadataUrl = `${config.api}/getCollectionMetadata/${collectionId}`;
                try {
                    const response = await fetch(metadataUrl);
                    const metadata = await response.json();
                    return { id: collectionId, metadata };
                } catch (e) {
                    console.error(e);
                    return { id: collectionId, metadata: null };
                }
            });
            return Promise.all(promises);
        }

        async function fetchMetadataForCollectionsSubset(subset) {
            const metadataArray = await fetchMetadataForCollections(subset, 0, subset.length);
            for (const metadataItem of metadataArray) {
                const collectionIndex = collections.value.findIndex(
                    (collection) => collection.id === metadataItem.id
                );
                if (collectionIndex !== -1) {
                    collections.value[collectionIndex].metadata = metadataItem.metadata;
                }
            }
        }

        function previousPage() {
            if (currentPage.value > 1) {
                currentPage.value -= 1;
            }
        }

        function nextPage() {
            if (currentPage.value < totalPages.value) {
                currentPage.value += 1;
            }
        }

        function handleImageError(event) {
            event.target.src = imgPlaceholder;
        }

        onMounted(async () => {
            await fetchCollections();
            const startIndex = (currentPage.value - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const subset = collections.value.slice(startIndex, endIndex);
            await fetchMetadataForCollectionsSubset(subset);
        });

        watch(currentPage, async (newValue) => {
            const startIndex = (newValue - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const subset = collections.value.slice(startIndex, endIndex);
            await fetchMetadataForCollectionsSubset(subset);
        });

        return {
            collections,
            currentPage,
            displayedCollections,
            totalPages,
            previousPage,
            nextPage,
            handleImageError,
            isLoading,
            error,
        };
    },
};
</script>