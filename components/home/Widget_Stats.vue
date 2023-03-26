<!-- Widget: Stats -->
<!-- Shows full statistic from KusamaHub, which contains numbers of collections, creators, transactions and etc. -->
<!-- Wiki:  -->
<template>
    <div class="widget-row-1">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-stats.svg">Stats</div>
            </div>
            <div class="widget-content">
                <div v-if="isLoading" class="widget-content-placeholder"></div>
                <div v-else class="stats-grid-main">
                    <div class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.collections_count }}</pre>
                        </div>
                        <div class="stats-name">Collections</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.creators_count }}</pre>
                        </div>
                        <div class="stats-name">Creators</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.block_count }}</pre>
                        </div>
                        <div class="stats-name">Blocks</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.rating_count }}</pre>
                        </div>
                        <div class="stats-name">Ratings</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.reviews_count }}</pre>
                        </div>
                        <div class="stats-name">Reviews</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.hub_calendar_count }}</pre>
                        </div>
                        <div class="stats-name">Events</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from "vue";

export default {
    name: 'Widget_Collection_Stats',

    setup() {
        const config = useRuntimeConfig();
        const isLoading = ref(false);
        const route = useRoute();
        const stats = ref({});

        async function fetchItems() {
            try {
                isLoading.value = true;
                const response = await fetch(
                    `${config.api}/getStats`
                );
                const data = await response.json();
                stats.value = data;

                if (data && data.singular_stats) {

                }
            } catch (error) {
                console.error('Error fetching collection stats:', error);
            } finally {
                isLoading.value = false;
            }
        }

        onMounted(fetchItems);

        return {
            isLoading,
            stats,
        };
    }
};
</script>