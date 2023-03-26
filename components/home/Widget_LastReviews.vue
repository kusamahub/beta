<!-- Widget: Latest reviews -->
<!-- Shows latest reviews writen by any user for any collection -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title">
                <img src="@/static/images/icons/icon-reviews.svg" />Latest Reviews
            </div>
            <div class="widget-menu-container">
                <div class="widget-menu" ref="menuContainer" @click="toggleMenu">
                    {{ category }} <i class="material-icons">keyboard_arrow_down</i>
                </div>
                <div class="widget-menu-dropdown" ref="menu" v-if="isMenuOpen">
                    <div class="widget-menu-dropdown-item" v-for="item in periods" :key="item" @click="selectItem(item)">
                        {{ item }}
                    </div>
                </div>
            </div>
        </div>
        <div class="widget-content widget-scrollable">
            <div v-if="latestReviews === null" class="widget-content-placeholder"></div>
            <div v-else>
                <router-link class="review-container" v-for="review in latestReviews" :key="review.review_id" :to="category === 'Collections' ? 'collection/' + review.collection_id : 'creator/' + review.creator_id">
                    <div class="review-header">
                        <div class="reviewer-meta">
                            <span class="reviewer-name">{{
                                shortenAddress(review.user_id)
                                }}</span>
                            <span> left a review to </span>
                            <span class="review-to">{{
                                category === 'Collections'
                                ? review.collection_id
                                : shortenAddress(review.creator_id)
                                }}</span>
                        </div>
                    </div>
                    <div class="review-content">
                        <div class="reviewer-text">{{ review.user_review }}</div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted, watch } from 'vue';
const config = useRuntimeConfig();

export default {
    name: 'Widget_LastReviews',

    setup() {
        const latestReviews = ref([]);
        const isMenuOpen = ref(false);
        const periods = ['Collections', 'Creators'];
        const category = ref(localStorage.getItem('reviewCategory') || 'Collections');

        watch(category, (newVal) => {
            localStorage.setItem('reviewCategory', newVal);
        });

        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
        };

        const nuxtApp = useNuxtApp();

        const shortenAddress = (address) => {
            return nuxtApp.shortenAddress(address);
        };

        const selectItem = (item) => {
            category.value = item;
            isMenuOpen.value = false;
            fetchReviews();
        };

        async function fetchReviews() {
            try {
                const response = await fetch(`${config.api}/getLatestReviews`);
                const data = await response.json();
                if (category.value === 'Collections') {
                    latestReviews.value = data.last_collection_reviews;
                } else {
                    latestReviews.value = data.last_creator_reviews;
                }
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            }
        }

        onMounted(async () => {
            await fetchReviews();
        });

        return {
            latestReviews,
            isMenuOpen,
            periods,
            category,
            toggleMenu,
            selectItem,
            shortenAddress
        };
    },
};
</script>