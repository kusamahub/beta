<!-- Page: Creator Page -->
<!-- Creator page template -->
<!-- Wiki:  -->
<template>
    <div>
        <Main_Header />
        <div class="content">
            <Widget_Creator_Card />
            <div class="widget-row-1">
                <Widget_Creator_User_Rating />
                <Widget_Creator_Editors_Rating />
                <Widget_Creator_Vote />
            </div>
            <div class="widget-row-1">
                <Widget_Creator_Projects />
            </div>
            <div class="widget-row-1">
                <Widget_Creator_Reviews />
            </div>
            <div class="widget-row-1">
                <Widget_Creator_Calendar />
                <Widget_Creator_Verify />
            </div>
            <Widget_Creator_Links />
            <Widget_Feedback />
        </div>
        <Main_Footer />
    </div>
</template>
<script>
import Main_Header from '~/components/header/Main_Header.vue';
import Main_Footer from '~/components/footer/Main_Footer.vue';
import Widget_Creator_Card from '~/components/creator/Widget_Creator_Card.vue';
import Widget_Creator_User_Rating from '~/components/creator/Widget_Creator_User_Rating.vue';
import Widget_Creator_Editors_Rating from '~/components/creator/Widget_Creator_Editors_Rating.vue';
import Widget_Creator_Vote from '~/components/creator/Widget_Creator_Vote.vue';
import Widget_Creator_Projects from '~/components/creator/Widget_Creator_Projects';
import Widget_Creator_Calendar from '~/components/creator/Widget_Creator_Calendar';
import Widget_Creator_Reviews from '~/components/creator/Widget_Creator_Reviews';
import Widget_Creator_Verify from '~/components/creator/Widget_Creator_Verify';
import Widget_Creator_Links from '~/components/creator/Widget_Creator_Links';

import Widget_Feedback from '~/components/feedback/Widget_Feedback.vue';
import Widget_Creator_Telegram from '~/components/creator/Widget_Creator_Telegram.vue';
import Widget_Creator_Twitter from '~/components/creator/Widget_Creator_Twitter.vue';
import Widget_Creator_Discord from '~/components/creator/Widget_Creator_Discord.vue';

export default {

    components: {
        Main_Header,
        Main_Footer,
        Widget_Creator_Card,
        Widget_Creator_User_Rating,
        Widget_Creator_Editors_Rating,
        Widget_Creator_Vote,
        Widget_Creator_Projects,
        Widget_Creator_Calendar,
        Widget_Creator_Reviews,
        Widget_Creator_Verify,
        Widget_Creator_Links,
        Widget_Feedback,
        Widget_Creator_Telegram,
        Widget_Creator_Twitter,
        Widget_Creator_Discord,
        Widget_Creator_Links
    },
}
</script>