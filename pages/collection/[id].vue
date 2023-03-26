<!-- Page: Collection -->
<!-- Collection page template -->
<!-- Wiki:  -->
<template>
    <div>
        <Main_Header />
        <div class="content">
            <Widget_Collection_Card />
            <div class="widget-row-1">
                <Widget_Collection_User_Rating />
                <Widget_Collection_Editors_Rating />
                <Widget_Collection_Vote />
            </div>
            <Widget_Collection_Stats />
            <div class="widget-row-1">
                <Widget_Collection_Analytics_ATH />
                <Widget_Collection_Analytics_FLOOR />
            </div>
            <div class="widget-row-1">
                <Widget_Collection_Analytics_HOLD />
            </div>
            <div class="widget-row-1">
                <Widget_Collection_Holders />
            </div>
            <Widget_Collection_Items />
            <div class="widget-row-1">
                <Widget_Collection_Twitter />
                <Widget_Collection_Discord />
            </div>
            <div class="widget-row-1">
                <Widget_Collection_Calendar />
                <Widget_Collection_Telegram />
            </div>
            <Widget_Collection_Reviews />
            <div class="widget-row-1">
                <Widget_Collection_Creator />
                <Widget_Collection_Verify />
            </div>
            <Widget_Collection_Links />
            <Widget_Feedback />
        </div>
        <Main_Footer />
    </div>
</template>
<script>
import Main_Header from '~/components/header/Main_Header.vue';
import Main_Footer from '~/components/footer/Main_Footer.vue';
import Widget_Collection_Card from '~/components/collection/Widget_Collection_Card.vue';
import Widget_Collection_User_Rating from '~/components/collection/Widget_Collection_User_Rating.vue';
import Widget_Collection_Editors_Rating from '~/components/collection/Widget_Collection_Editors_Rating.vue';
import Widget_Collection_Vote from '~/components/collection/Widget_Collection_Vote.vue';
import Widget_Collection_Stats from '~/components/collection/Widget_Collection_Stats';
import Widget_Collection_Analytics_ATH from '~/components/collection/Widget_Collection_Analytics_ATH.vue';
import Widget_Collection_Analytics_FLOOR from '~/components/collection/Widget_Collection_Analytics_FLOOR.vue';
import Widget_Collection_Items from '~/components/collection/Widget_Collection_Items';
import Widget_Collection_Calendar from '~/components/collection/Widget_Collection_Calendar';
import Widget_Collection_Reviews from '~/components/collection/Widget_Collection_Reviews';
import Widget_Collection_Creator from '~/components/collection/Widget_Collection_Creator';
import Widget_Collection_Verify from '~/components/collection/Widget_Collection_Verify';
import Widget_Collection_Links from '~/components/collection/Widget_Collection_Links';
import Widget_Collection_Twitter from '~/components/collection/Widget_Collection_Twitter.vue';
import Widget_Collection_Discord from '~/components/collection/Widget_Collection_Discord.vue';
import Widget_Collection_Telegram from '~/components/collection/Widget_Collection_Telegram.vue';

import Widget_Feedback from '~/components/feedback/Widget_Feedback.vue';
import Widget_Collection_Analytics_HOLD from '~/components/collection/Widget_Collection_Analytics_HOLD.vue';
import Widget_Collection_Holders from '../../components/collection/Widget_Collection_Holders.vue';

export default {

    components: {
        Main_Header,
        Main_Footer,
        Widget_Collection_Card,
        Widget_Collection_User_Rating,
        Widget_Collection_Editors_Rating,
        Widget_Collection_Vote,
        Widget_Collection_Stats,
        Widget_Collection_Items,
        Widget_Collection_Calendar,
        Widget_Collection_Reviews,
        Widget_Collection_Creator,
        Widget_Collection_Verify,
        Widget_Collection_Links,
        Widget_Feedback,
        Widget_Collection_Twitter,
        Widget_Collection_Discord,
        Widget_Collection_Telegram,
        Widget_Collection_Analytics_ATH,
        Widget_Collection_Analytics_FLOOR,
        Widget_Collection_Analytics_HOLD,
        Widget_Collection_Holders
    },

}
</script>