<!-- Widget: News -->
<!-- Shows latest news from KusamaHub or Kusama Blog -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <router-link to="/news">
                <div class="widget-title"><img src="@/static/images/icons/icon-news.svg">News</div>
            </router-link>
            <div class="widget-menu-container">
                <div class="widget-menu" ref="menuContainer" @click="toggleMenu">{{ selectedItem }} <i class="material-icons">keyboard_arrow_down</i></div>
                <div class="widget-menu-dropdown" ref="menu" v-if="isMenuOpen">
                    <div class="widget-menu-dropdown-item" v-for="item in items" :key="item" @click="selectItem(item)">{{ item }}</div>
                </div>
            </div>
        </div>
        <div class="widget-content widget-scrollable">
            <div v-if="newsPosts === null" class="widget-content-placeholder"></div>
            <div v-else>
                <div v-if="newsPosts.length > 0">
                    <router-link class="widget-news-block" v-for="post in newsPosts" :key="post.news_id" :to="`/news`">
                        <div class="widget-news-title">{{ post.news_title }}</div>
                        <div class="widget-news-content">{{ post.news_body }}</div>
                        <div class="widget-news-source">{{ post.news_author }}</div>
                    </router-link>
                </div>
                <div v-else>
                    <div class="widget-no-content">No news yet 😕</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const config = useRuntimeConfig()

export default {

    name: 'Widget_News',

    data() {
        return {
            newsPosts: null,
            newsList: [],
            isMenuOpen: false,
            selectedItem: 'KusamaHub',
            items: ['KusamaHub'],
        }

    },

    mounted() {

        fetch(config.api + '/getNews')
            .then((response) => response.json())
            .then((data) => {
                this.newsPosts = data.sort((a, b) => {
                    return new Date(b.created_date) - new Date(a.created_date);
                });
            });

        document.addEventListener('click', this.handleOutsideClick);
        document.addEventListener('keydown', this.handleEscKey);

    },

    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        selectItem(item) {
            this.selectedItem = item;
            this.isMenuOpen = false;
        },
        handleOutsideClick(event) {
            if (this.isMenuOpen && !this.$refs.menu.contains(event.target) && !this.$refs.menuContainer.contains(event.target)) {
                this.isMenuOpen = false;
            }
        },
        handleEscKey(event) {
            if (event.key === 'Escape') {
                this.isMenuOpen = false;
            }
        },
    },

    beforeDestroy() {
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('keydown', this.handleEscKey);
    },

};
</script>