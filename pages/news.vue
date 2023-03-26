<!-- Page: News -->
<!-- Contains all news from KusamaHub and Kusama Blog -->
<!-- Wiki:  -->
<template>
    <div>
        <Main_Header />
        <div class="content">
            <div class="widget-row-1">
                <div class="widget">
                    <div class="widget-header">
                        <div class="widget-title"><img src="@/static/images/icons/icon-news.svg">News</div>
                    </div>
                    <div class="widget-content">
                        <div v-if="newsPosts === null" class="widget-content-placeholder"></div>
                        <div v-else>
                            <template v-if="newsPosts.length > 0">
                                <div class="widget-news-block" v-for="post in newsPosts" :key="post.news_id">
                                    <div class="widget-news-title">{{ post.news_title }}</div>
                                    <div class="widget-news-content">{{ post.news_body }}</div>
                                    <div class="widget-news-source">{{ post.news_author }}</div>
                                    <div class="widget-news-source">{{ post.news_link }}</div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="widget-no-content">No news yet 😕</div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <Widget_Feedback />
        </div>
        <Main_Footer />
    </div>
</template>
<script>
import Main_Header from '~/components/header/Main_Header.vue';
import Main_Footer from '~/components/footer/Main_Footer.vue';

import Widget_Feedback from '~/components/feedback/Widget_Feedback.vue';

const config = useRuntimeConfig()

export default {

    components: { Main_Header, Main_Footer, Widget_Feedback },

    name: 'Widget_News',

    data() {
        return {
            newsPosts: null,
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
    }

};
</script>