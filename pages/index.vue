<!-- Page: Main -->
<!-- Main page of KusamaHub -->
<!-- Wiki:  -->
<template>
    <Main_Header />
    <div class="content">
        <Widget_Announce />
        <Widget_Highlights />
        <div class="widget-row-1">
            <Widget_Explore_Collections />
            <Widget_Explore_Creators />
            <Widget_KusamaPrice />
        </div>
        <div class="widget-row-1">
            <Widget_TopCreators />
            <Widget_TopProjects />
        </div>
        <Widget_Stats />
        <div class="widget-row-1">
            <Widget_News />
            <Widget_LastReviews />
        </div>
        <Widget_Calendar />
        <Widget_Feedback />
    </div>
    <Main_Footer />
</template>
<script>
import Widget_Highlights from '~/components/home/Widget_Highlights.vue';
import Widget_Explore_Collections from '~/components/home/Widget_Explore_Collections.vue';
import Widget_Explore_Creators from '~/components/home/Widget_Explore_Creators.vue';
import Widget_KusamaPrice from '~/components/home/Widget_KusamaPrice.vue';
import Widget_TopCreators from '~/components/home/Widget_TopCreators.vue';
import Widget_TopProjects from '~/components/home/Widget_TopProjects.vue';
import Widget_Stats from '~/components/home/Widget_Stats.vue';
import Widget_Calendar from '~/components/home/Widget_Calendar.vue';
import Widget_News from '~/components/home/Widget_News.vue';
import Widget_LastReviews from '~/components/home/Widget_LastReviews.vue';
import Main_Header from '~/components/header/Main_Header.vue';
import Main_Footer from '~/components/footer/Main_Footer.vue';
import Widget_Announce from '~/components/home/Widget_Announce.vue';
import Widget_Feedback from '~/components/feedback/Widget_Feedback.vue'
import Widget_Twitter from '~/components/home/Widget_Twitter.vue';
import Widget_Telegram from '~/components/home/Widget_Telegram.vue';
import Widget_Discord from '~/components/home/Widget_Discord.vue';

export default {
    components: {
        Widget_Highlights,
        Widget_Explore_Collections,
        Widget_Explore_Creators,
        Widget_KusamaPrice,
        Widget_Calendar,
        Widget_TopCreators,
        Widget_TopProjects,
        Widget_Stats,
        Widget_News,
        Widget_LastReviews,
        Main_Header,
        Main_Footer,
        Widget_Announce,
        Widget_Feedback,
        Widget_Twitter,
        Widget_Telegram,
        Widget_Discord
    },

    methods: {

    },
};
</script>