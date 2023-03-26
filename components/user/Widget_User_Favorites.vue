<!-- Widget: User's Favorites -->
<!-- Contains items (projects, creators, NFTs) that users adds to favorites -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title">
                <img src="@/static/images/icons/icon-userfavorites.svg" />Favorites
            </div>
        </div>
        <div class="widget-content widget-scrollable">
            <div v-if="isLoading" class="widget-content-placeholder"></div>
            <div v-else>
                <div v-if="data.length === 0" class="widget-no-content">No favorites</div>
                <div v-else>
                    <div class="favorite-item" v-for="favorite in data" :key="favorite.favorite_id">
                        {{ favorite.item_id }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
    name: 'Widget_User_Favorites',

    setup() {
        const route = useRoute();
        const config = useRuntimeConfig();
        const isLoading = ref(false);
        const data = ref([]);

        async function fetchFavorites() {
            isLoading.value = true;
            try {
                const response = await fetch(config.api + '/getUserFavorites/' + route.params.id);
                const jsonData = await response.json();

                // Shorten the item_id for creators
                data.value = jsonData.map(favorite => {
                    if (favorite.item_type === 'creator') {
                        return {
                            ...favorite,
                            item_id: useNuxtApp().shortenAddress(favorite.item_id),
                        };
                    }
                    return favorite;
                });
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                isLoading.value = false;
            }
        }

        onMounted(async () => {
            await fetchFavorites();
        });

        return {
            isLoading,
            data,
        };
    },
};
</script>