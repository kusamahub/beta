<!-- Widget: Top Projects -->
<!-- Shows list of projects sorted by different filters (sales, reviews, rating etc) -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title">
                <img src="@/static/images/icons/icon-topprojects.svg" />Top projects
            </div>
            <div class="widget-menu-container">
                <div class="widget-menu" ref="menuContainer" @click="toggleMenu">
                    {{ currentPeriod }} <i class="material-icons">keyboard_arrow_down</i>
                </div>
                <div class="widget-menu-dropdown" ref="menu" v-if="isMenuOpen">
                    <div class="widget-menu-dropdown-item" v-for="item in periods" :key="item" @click="selectItem(item)">
                        {{ item }}
                    </div>
                </div>
            </div>
        </div>
        <div class="widget-content widget-scrollable">
            <div v-if="isLoading" class="widget-content-placeholder"></div>
            <div v-else>
                <router-link class="top-container" v-for="collection in collections" :key="collection.id" :to="`/collection/${collection.id}`">
                    <div class="top-card">
                        <div class="project-card-mini">
                            <div class="project-card-mini-image">
                                <img :src="getDisplayCollection(collection).metadata.mediaUri" @error="handleImageError" />
                            </div>
                            <div class="project-card-mini-meta">
                                <div class="project-card-mini-name">
                                    {{ getDisplayCollection(collection).metadata.name }}
                                </div>
                                <div class="project-card-mini-creator">
                                    {{ getDisplayCollection(collection).currentOwner }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="top-info">
                        <div class="top-info-stats">{{ collection.stats.count }}</div>
                        <div class="top-info-name">sales</div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import imgPlaceholder from '@/static/collection_placeholder.svg';

const config = useRuntimeConfig();

export default {
    name: 'Widget_TopProjects',

    setup() {
        const collections = ref([]);
        const isLoading = ref(false);
        const error = ref(null);

        const periodMap = {
            'Last 24 hours': '24h',
            'Last 7 days': '7d',
            'Last 1 month': '1m',
        };

        const periods = Object.keys(periodMap);
        const currentPeriod = ref(localStorage.getItem('selectedPeriod') || periods[0]);
        const isMenuOpen = ref(false);

        watch(currentPeriod, (newValue) => {
            localStorage.setItem('selectedPeriod', newValue);
            fetchCollections();
        });

        // Fetch top collections
        async function fetchCollections() {
            isLoading.value = true;
            try {
                const period = periodMap[currentPeriod.value];
                const response = await fetch(`${config.api}/getTopCollections/${period}`);
                const data = await response.json();
                const collectionPromises = data.map(async (collection) => {
                    const collectionResponse = await fetch(`${config.api}/getCollection/${collection.id}`);
                    const collectionData = await collectionResponse.json();
                    return {
                        id: collection.id, // Add this line to include the id in the response
                        ...collectionData,
                        stats: collection.stats,
                    };
                });
                collections.value = await Promise.all(collectionPromises);
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = 'Failed to fetch collections';
            }
            isLoading.value = false;
        }

        // Format issuer and image
        function getDisplayCollection(collection) {
            let formattedIssuer = '';

            if (collection.data_from === 'singular') {
                formattedIssuer = collection.collection_data.issuer ?
                    useNuxtApp().shortenAddress(collection.collection_data.issuer) :
                    '';
            } else {
                formattedIssuer = collection.currentOwner ?
                    useNuxtApp().shortenAddress(collection.currentOwner) :
                    '';
            }

            const metadata = collection.collection_meta || null;
            const formattedMetadata = metadata ?
                { ...metadata, mediaUri: useNuxtApp().getImage(metadata.mediaUri) } :
                null;
            return { ...collection, currentOwner: formattedIssuer, metadata: formattedMetadata };
        }

        // Replace broken images
        function handleImageError(event) {
            event.target.src = imgPlaceholder;
        }

        // Widget menu handlers:
        function toggleMenu() {
            isMenuOpen.value = !isMenuOpen.value;
        }

        function selectItem(item) {
            currentPeriod.value = item;
            isMenuOpen.value = false;
        }

        function handleOutsideClick(event) {
            if (
                isMenuOpen.value &&
                !menu.value.contains(event.target) &&
                !menuContainer.value.contains(event.target)
            ) {
                isMenuOpen.value = false;
            }
        }

        function handleEscKey(event) {
            if (event.key === 'Escape') {
                isMenuOpen.value = false;
            }
        }

        const menu = ref(null);
        const menuContainer = ref(null);

        onMounted(async () => {
            await fetchCollections();
            document.addEventListener('click', handleOutsideClick);
            document.addEventListener('keydown', handleEscKey);
        });

        onUnmounted(() => {
            document.removeEventListener('click', handleOutsideClick);
            document.removeEventListener('keydown', handleEscKey);
        });

        return {
            collections,
            handleImageError,
            isLoading,
            error,
            getDisplayCollection,
            isMenuOpen,
            toggleMenu,
            selectItem,
            currentPeriod,
            periods,
            menu,
            menuContainer,
        };
    },
};
</script>