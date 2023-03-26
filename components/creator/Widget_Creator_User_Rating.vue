<!-- Widget: User Rating for Creator -->
<!-- Users rating for current creator -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><img src="@/static/images/icons/icon-userrating.svg">User Rating</div>
        </div>
        <div class="widget-content">
            <div class="votes-container">
                <div class="vote-up">
                    <div class="vote-symbol">👍</div>
                    <div class="vote-count">
                        <div v-if="ratingThumbUp === null" class="widget-content-placeholder"></div>
                        <div v-else>{{ ratingThumbUp }}</div>
                    </div>
                </div>
                <div class="vote-down">
                    <div class="vote-symbol">👎</div>
                    <div class="vote-count">
                        <div v-if="ratingThumbDown === null" class="widget-content-placeholder"></div>
                        <div v-else>{{ ratingThumbDown }}</div>
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
    name: 'Widget_Creator_User_Rating',

    setup() {
        const ratingThumbUp = ref(null);
        const ratingThumbDown = ref(null);
        const route = useRoute();
        const config = useRuntimeConfig();

        onMounted(async () => {
            try {
                const responseThumbUp = await fetch(config.api + '/getCreatorRating/' + route.params.id + '/vote_up');
                const dataThumbUp = await responseThumbUp.json();
                ratingThumbUp.value = dataThumbUp.thumbs_up || 0;

                const responseThumbDown = await fetch(config.api + '/getCreatorRating/' + route.params.id + '/vote_down');
                const dataThumbDown = await responseThumbDown.json();
                ratingThumbDown.value = dataThumbDown.thumbs_down || 0;
            } catch (error) {
                console.error('Error fetching user ratings:', error);
            }
        });

        return {
            ratingThumbUp,
            ratingThumbDown,
        };
    },
};
</script>