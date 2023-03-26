<template>
    <div class="widget-row-1" ref="scrollTop">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title">
                    <img src="@/static/images/icons/icon-projectnfts.svg" />Items
                </div>
                <div class="widget-filters">
                    <div class="widget-filters-filter" :class="{ 'active': selectedCollection === 'rmrk1' }" @click="selectCollection('rmrk1')">
                        RMRK 1
                    </div>
                    <div class="widget-filters-filter" :class="{ 'active': selectedCollection === 'rmrk2' }" @click="selectCollection('rmrk2')">
                        RMRK 2
                    </div>
                </div>
            </div>
            <div class="widget-content">
                <div v-if="isLoading" class="widget-content-placeholder"></div>
                <div v-if="!displayedNFTs.length" class="widget-no-content"><br><br>No items</div>
                <div v-else>
                    <div class="nfts-grid">
                        <div class="nft-card" :id="`${nft.id}`" v-for="nft in displayedNFTs" :key="nft.id">
                            <div class="nft-card-image">
                                <img :src="nft.image" @error="handleImageError($event)" />
                            </div>
                            <div class="nft-card-name">{{ nft.name }}</div>
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
import { ref, computed, onMounted, watch } from "vue";
import imgPlaceholder from "@/static/nft_placeholder.svg";

const config = useRuntimeConfig();

export default {
    name: "Widget_User_Items",

    setup() {
        const nfts = ref({});
        const isLoading = ref(false);
        const error = ref(null);
        const showAll = ref(false);
        const route = useRoute();

        const selectedCollection = ref("rmrk2");

        const displayedNFTs = computed(() => {
            if (!nfts.value || !nfts.value[selectedCollection.value]) {
                return [];
            }

            const selectedNfts = nfts.value[selectedCollection.value];

            if (showAll.value) {
                return selectedNfts;
            } else {
                return selectedNfts.slice(0, 5);
            }
        });


        const collectionFilters = computed(() =>
            Object.keys(nfts.value).filter(
                (collection) => nfts.value[collection].length > 0
            )
        );

        function selectCollection(collectionKey) {
            selectedCollection.value = collectionKey;
            showAll.value = false;
            if (!nfts.value[collectionKey]) {
                fetchItems(collectionKey);
            }
        }

        const moreThanFiveItems = computed(() => {
            if (!nfts.value || !selectedCollection.value) {
                return false;
            }
            return nfts.value[selectedCollection.value].length > 5;
        });


        async function fetchItems(collectionKey) {
            isLoading.value = true;
            try {
                const response = await fetch(
                    `${config.api}/getUserItems/${route.params.id}`
                );
                const data = await response.json();
                nfts.value[collectionKey] = data[collectionKey];
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
            await fetchItems(selectedCollection.value);
        });


        return {
            displayedNFTs,
            isLoading,
            error,
            toggleShowAll,
            showAll,
            moreThanFiveItems,
            handleImageError,
            collectionFilters,
            selectCollection,
            selectedCollection
        };
    },
};
</script>