<!-- Widget: User Reviews History -->
<!-- Contains all reviews, thta user wrote on projects and creators -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><img src="@/static/images/icons/icon-reviews.svg">Reviews</div>
        </div>
        <div class="widget-content widget-scrollable">
            <div v-if="isLoading" class="widget-content-placeholder"></div>
            <div v-else>
                <div v-if="!hasReviews" class="widget-no-content">No reviews</div>
                <div v-else>
                    <div v-for="review in combinedReviews" :key="review.review_id" class="favorite-item">
                        {{ review.user_review }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
    name: 'Widget_Creator_Reviews',

    setup() {
        const route = useRoute();
        const config = useRuntimeConfig();
        const isLoading = ref(false);
        const data = ref({ user_collection_reviews: [], user_creator_reviews: [] });

        async function fetchReviews() {
            isLoading.value = true;
            try {
                const response = await fetch(config.api + '/getUserReviews/' + route.params.id);
                const jsonData = await response.json();
                data.value = jsonData;
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                isLoading.value = false;
            }
        }

        onMounted(async () => {
            await fetchReviews();
        });

        const combinedReviews = computed(() => {
            return [...data.value.user_collection_reviews, ...data.value.user_creator_reviews];
        });

        const hasReviews = computed(() => {
            return data.value.user_collection_reviews.length > 0 || data.value.user_creator_reviews.length > 0;
        });

        return {
            isLoading,
            combinedReviews,
            hasReviews,
        };
    },
};
</script>