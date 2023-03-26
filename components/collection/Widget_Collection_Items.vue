<template>
    <div class="widget-row-1" ref="scrollTop">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title">
                    <img src="@/static/images/icons/icon-projectnfts.svg" />Items
                </div>
            </div>
            <div class="widget-content">
                <div v-if="isLoading" class="widget-content-placeholder"></div>
                <div v-else>
                    <div class="nfts-grid" v-for="(collection, index) in displayedNFTs" :key="index">
                        <div class="nft-card" :id="`${nft.id}`" v-for="nft in collection.nfts" :key="nft.id">
                            <div class="nft-card-image">
                                <img :src="nft.image" @error="handleImageError">
                            </div>
                            <div class="nft-card-name">{{ nft.displayName }}</div>
                        </div>
                    </div>
                    <div v-if="moreThanFiveItems" @click="toggleShowAll" class="nft-cards-btn">
                        {{ showAll ? 'Show less' : 'Show all' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, computed, onMounted } from "vue";
import imgPlaceholder from "@/static/nft_placeholder.svg";

const config = useRuntimeConfig();

export default {
    name: "Widget_Collection_Items",

    setup() {
        const nfts = ref([]);
        const isLoading = ref(false);
        const error = ref(null);
        const showAll = ref(false);
        const route = useRoute();

        const displayedNFTs = computed(() => {
            if (!nfts.value) {
                return [];
            }

            if (showAll.value) {
                return nfts.value;
            } else {
                const flattenedNFTs = nfts.value.flatMap(collection => collection.nfts);
                const slicedFlattenedNFTs = flattenedNFTs.slice(0, 5);
                const displayedCollections = [];

                nfts.value.forEach(collection => {
                    const filteredNFTs = collection.nfts.filter(nft => slicedFlattenedNFTs.includes(nft));
                    if (filteredNFTs.length > 0) {
                        displayedCollections.push({
                            ...collection,
                            nfts: filteredNFTs
                        });
                    }
                });

                return displayedCollections;
            }
        });



        const moreThanFiveItems = computed(() => {
            if (!nfts.value) {
                return false;
            }

            const totalNFTs = nfts.value.reduce((total, collection) => total + collection.nfts.length, 0);
            return totalNFTs > 5;
        });


        async function fetchItems() {
            isLoading.value = true;
            try {
                const response = await fetch(
                    `${config.api}/getCollectionItems/${route.params.id}`
                );
                const data = await response.json();

                const collectionData = data.collection_data;
                const dataFrom = data.data_from;

                if (collectionData) {
                    const formattedCollectionEntities = collectionData.map(item => {
                        let displayName;
                        let image;

                        if (dataFrom === 'rubick') {
                            displayName = item.name;
                            image = useNuxtApp().getImage(item.meta.image);
                        } else if (dataFrom === 'singular') {
                            displayName = item.metadata_name;
                            image = useNuxtApp().getImage(item.metadata_image);
                        }

                        return {
                            ...item,
                            displayName,
                            image
                        };
                    });

                    nfts.value = [{ nfts: formattedCollectionEntities }];
                } else {
                    nfts.value = [];
                }

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
            if (!showAll.value) {
                this.$nextTick(() => {
                    const scrollTop = this.$refs.scrollTop.offsetTop;
                    window.scrollTo({
                        top: scrollTop,
                        behavior: "smooth",
                    });
                });
            }
        }

        function handleImageError(event) {
            event.target.src = imgPlaceholder;
        }

        onMounted(async () => {
            await fetchItems();
        });

        return {
            displayedNFTs,
            isLoading,
            error,
            toggleShowAll,
            showAll,
            moreThanFiveItems,
            handleImageError
        };
    },
};
</script>