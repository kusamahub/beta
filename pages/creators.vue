<template>
    <div>
        <Main_Header />
        <div class="content">
            <div class="widget-row-1">
                <div class="widget">
                    <div class="widget-header">
                        <div class="widget-title"><img src="@/static/images/icons/icon-creators.svg" />Creators</div>
                    </div>
                    <div class="widget-content">
                        <div v-if="isLoading" class="widget-content-placeholder"></div>
                        <div v-else class="coneten">
                            <div class="creators-grid">
                                <div class="creator-card" v-for="creator in displayedCreators" :key="creator.id">
                                    <router-link :to="`/creator/${creator.longIssuer}`">
                                        <div class="creator-card-image">
                                            <img :src="imgPlaceholder">
                                        </div>
                                        <div class="project-card-name">{{ creator.name }}</div>
                                        <div class="creator-card-address">{{ creator.shortIssuer }}</div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="widget-page-switch">
                                <button class="widget-page-number" @click="previousPage" :disabled="currentPage === 1">
                                    Previous
                                </button>
                                <button class="widget-page-number" @click="nextPage" :disabled="currentPage === totalPages">
                                    Next
                                </button>
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

import imgPlaceholder from '@/static/creator_placeholder.svg';

const config = useRuntimeConfig();

export default {
    components: { Main_Header, Main_Footer, Widget_Feedback },
    name: 'Creators',

    setup() {
        const creators = ref([]);
        const currentPage = ref(1);
        const itemsPerPage = 10;
        const isLoading = ref(false);
        const error = ref(null);

        const totalPages = computed(() => {
            return Math.ceil(creators.value.length / itemsPerPage);
        });

        const displayedCreators = computed(() => {
            const startIndex = (currentPage.value - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            return creators.value.slice(startIndex, endIndex).map((creator) => {
                const formattedIssuer = useNuxtApp().shortenAddress(creator.issuer);
                const metadata = creator.metadata || null;
                const name = metadata ? metadata.name : 'Creator';
                const longIssuer = creator.issuer;
                return { ...creator, shortIssuer: formattedIssuer, metadata, name, longIssuer };
            });
        });


        async function fetchCreators() {
            isLoading.value = true;
            try {
                const response = await fetch(`${config.api}/getCreators`);
                const data = await response.json();
                creators.value = data.creators.map((creator) => ({
                    ...creator,
                    id: creator.issuer,
                }));
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = 'Failed to fetch creators';
            }
            isLoading.value = false;
        }

        async function fetchMetadataForCreators(creators, startIndex, endIndex) {
            const subset = creators.slice(startIndex, endIndex);
            const promises = subset.map(async (creator) => {
                const creatorId = creator.id;
                const metadataUrl = `${config.api}/getCreatorMetadata/${creatorId}`;
                try {
                    const response = await fetch(metadataUrl);
                    const metadata = await response.json();
                    return { id: creatorId, metadata };
                } catch (e) {
                    console.error(e);
                    return { id: creatorId, metadata: null };
                }
            });
            return Promise.all(promises);
        }

        async function fetchMetadataForCreatorsSubset(subset) {
            const metadataArray = await fetchMetadataForCreators(subset, 0, subset.length);
            for (const metadataItem of metadataArray) {
                const creatorIndex = creators.value.findIndex(
                    (creator) => creator.id === metadataItem.id
                );
                if (creatorIndex !== -1) {
                    creators.value[creatorIndex].metadata = metadataItem.metadata;
                    creators.value[creatorIndex].name = metadataItem.metadata.name;
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

        onMounted(async () => {
            await fetchCreators();
            const startIndex = (currentPage.value - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const subset = creators.value.slice(startIndex, endIndex);
            await fetchMetadataForCreatorsSubset(subset);
        });

        watch(currentPage, async (newValue) => {
            const startIndex = (newValue - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const subset = creators.value.slice(startIndex, endIndex);
            await fetchMetadataForCreatorsSubset(subset);
        });

        return {
            creators,
            currentPage,
            displayedCreators,
            totalPages,
            previousPage,
            nextPage,
            isLoading,
            error,
            imgPlaceholder
        };
    },
};
</script>