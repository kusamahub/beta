<!-- Widget: Creator Projects -->
<!-- Contains all collections, where creator is issuer -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title">
                <img src="@/static/images/icons/icon-creatorprojects.svg" />Projects
            </div>
        </div>
        <div class="widget-content">
            <div v-if="isLoading" class="widget-content-placeholder"></div>
            <div v-else>
                <div class="projects-grid-creator">
                    <div class="project-card project-card-max-width" v-for="collection in displayedCollections" :key="collection.id">
                        <router-link :to="`/collection/${collection.id}`">
                            <div class="project-card-image">
                                <img :src="collection.image" @error="handleImageError" />
                            </div>
                            <div class="project-card-name">
                                {{ collection.name }}
                            </div>
                            <div class="project-card-creators">
                                {{ collection.issuer }}
                            </div>
                        </router-link>
                    </div>
                </div>
                <div v-if="moreThanFiveItems" @click="toggleShowAll" class="nft-cards-btn">
                    {{ showAll ? 'Show less' : 'Show all' }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, computed, onMounted } from "vue";
import imgPlaceholder from "@/static/collection_placeholder.svg";
import { useRoute } from "vue-router";

export default {
    name: "Widget_Creator_Projects",
    setup() {
        const collections = ref([]);
        const isLoading = ref(false);
        const error = ref(null);
        const showAll = ref(false);
        const route = useRoute();
        const config = useRuntimeConfig();

        const displayedCollections = computed(() => (showAll.value ? collections.value : collections.value.slice(0, 5)));

        const moreThanFiveItems = computed(() => collections.value.length > 5);



        async function fetchCollections() {
            const nuxtApp = useNuxtApp();
            isLoading.value = true;
            try {
                const response = await fetch(`${config.api}/getCreatorCollections/${route.params.id}`);
                const data = await response.json();
                const fetchedCollections = data.collections;

                for (const collection of fetchedCollections) {
                    const metadataResponse = await fetch(`${config.api}/getCollectionMetadata/${collection.id}`);
                    const metadata = await metadataResponse.json();
                    const imageUrl = metadata.mediaUri || metadata.image;
                    collection.image = nuxtApp.getImage(imageUrl);
                    collection.name = metadata.name;
                    collection.issuer = nuxtApp.shortenAddress(collection.issuer);
                }

                collections.value = fetchedCollections;
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = "Failed to fetch collections";
            } finally {
                isLoading.value = false;
            }
        }






        function toggleShowAll() {
            showAll.value = !showAll.value;
        }

        function handleImageError(event) {
            event.target.src = imgPlaceholder;
        }

        onMounted(async () => {
            await fetchCollections();
        });

        return {
            collections,
            displayedCollections,
            moreThanFiveItems,
            isLoading,
            error,
            showAll,
            toggleShowAll,
            handleImageError,
        };
    },
};
</script>