<!-- Widget: Collection Stats -->
<!-- Full statistic for current collection. Contains blockchain and KusamaHub data -->
<!-- Wiki:  -->
<template>
    <div class="widget-row-1">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-projectstats.svg">Project stats</div>
            </div>
            <div class="widget-content">
                <div v-if="isLoading" class="widget-content-placeholder"></div>
                <div v-else class="stats-grid">
                    <div class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.collection_rating_count }}</pre>
                        </div>
                        <div class="stats-name">Users Rating</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.collection_reviews_count }}</pre>
                        </div>
                        <div class="stats-name">Users Reviews</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.collection_reviews_count }}</pre>
                        </div>
                        <div class="stats-name">Calendar Events</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-date">
                            <pre>{{ stats.created }}</pre>
                        </div>
                        <div class="stats-name">Created</div>
                    </div>
                    <div class="stats-card">
                        <div class="stats-date">
                            <pre>{{ stats.last_update }}</pre>
                        </div>
                        <div class="stats-name">Last Update</div>
                    </div>
                    <div v-if="stats.singular_stats" class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.singular_stats.totalNFTs }}</pre>
                        </div>
                        <div class="stats-name">NFTs</div>
                    </div>
                    <div v-if="stats.singular_stats" class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.singular_stats.owners }}</pre>
                        </div>
                        <div class="stats-name">Owners</div>
                    </div>
                    <div v-if="stats.singular_stats" class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.singular_stats.floor }}</pre>
                        </div>
                        <div class="stats-name">Floor Price</div>
                    </div>
                    <div v-if="stats.singular_stats" class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.singular_stats.min }}</pre>
                        </div>
                        <div class="stats-name">Min Price</div>
                    </div>
                    <div v-if="stats.singular_stats" class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.singular_stats.max }}</pre>
                        </div>
                        <div class="stats-name">Max Price</div>
                    </div>
                    <div v-if="stats.singular_stats" class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.singular_stats.avg }}</pre>
                        </div>
                        <div class="stats-name">Average Price</div>
                    </div>
                    <div v-if="stats.singular_stats" class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.singular_stats.totalSales }}</pre>
                        </div>
                        <div class="stats-name">Total Sales</div>
                    </div>
                    <div v-if="stats.singular_stats" class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.singular_stats.itemsOnSale }}</pre>
                        </div>
                        <div class="stats-name">On Sale</div>
                    </div>
                    <div v-if="stats.singular_stats" class="stats-card">
                        <div class="stats-number">
                            <pre>{{ stats.singular_stats.lastSale }}</pre>
                        </div>
                        <div class="stats-name">Last Sale</div>
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
                    `${config.api}/getCollectionStats/${route.params.id}`
                );
                const data = await response.json();
                stats.value = data;

                if (data && data.singular_stats) {
                    const nuxtApp = useNuxtApp();
                    const formattedFloor = nuxtApp.formatPrice(data.singular_stats.floor);
                    const formattedCreatedDate = nuxtApp.formatDate(data.created);
                    const formattedUpdateDate = nuxtApp.formatDate(data.last_update);
                    const formattedAverage = nuxtApp.formatAverage(data.singular_stats.avg);
                    const formattedMin = nuxtApp.formatAverage(data.singular_stats.min);
                    const formattedMax = nuxtApp.formatAverage(data.singular_stats.max);
                    stats.value.singular_stats.avg = formattedAverage;
                    stats.value.singular_stats.floor = formattedFloor;
                    stats.value.singular_stats.max = formattedMax;
                    stats.value.singular_stats.min = formattedMin;
                    stats.value.last_update = formattedUpdateDate;
                    stats.value.created = formattedCreatedDate;
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