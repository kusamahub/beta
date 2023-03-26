<!-- Widget: User Rating History -->
<!-- Contains all ratings, that user set on projects and creators -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><img src="@/static/images/icons/icon-userrating.svg">User Rating</div>
        </div>
        <div class="widget-content">
            <div v-if="isLoading" class="widget-content-placeholder"></div>
            <div v-else>
                <div v-if="!hasRatings" class="widget-no-content">No ratings</div>
                <div v-else>
                    <div v-for="rating in transformedRatings" :key="rating.rating_id" class="favorite-item">
                        <span class="favorite-icon">{{ rating.ratingEmoji }}</span>{{ rating.collection_id || rating.creator_id }}
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
    name: 'Widget_Creator_User_Rating',

    setup() {
        const route = useRoute();
        const config = useRuntimeConfig();
        const isLoading = ref(false);
        const data = ref({ user_collection_ratings: [], user_creator_ratings: [] });

        async function fetchReviews() {
            isLoading.value = true;
            try {
                const response = await fetch(config.api + '/getUserRatings/' + route.params.id);
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

        const combinedRatings = computed(() => {
            return [...data.value.user_collection_ratings, ...data.value.user_creator_ratings];
        });

        const hasRatings = computed(() => {
            return data.value.user_collection_ratings.length > 0 || data.value.user_creator_ratings.length > 0;
        });

        const transformedRatings = computed(() => {
            return combinedRatings.value.map(rating => {
                let ratingEmoji;
                if (rating.user_rating === 'vote_up') {
                    ratingEmoji = '👍';
                } else if (rating.user_rating === 'vote_down') {
                    ratingEmoji = '👎';
                }

                return {
                    ...rating,
                    creator_id: rating.creator_id ? useNuxtApp().shortenAddress(rating.creator_id) : rating.creator_id,
                    ratingEmoji,
                };
            });
        });


        return {
            isLoading,
            transformedRatings,
            hasRatings,
        };
    },
}
</script>