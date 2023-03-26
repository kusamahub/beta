<!-- Page: User page -->
<!-- User page template -->
<!-- Wiki:  -->
<template>
    <div>
        <Main_Header />
        <div class="content">
            <Widget_User_Card />
            <div class="widget-row-1">
                <Widget_User_Favorites />
                <Widget_User_Rating />
                <Widget_User_Reviews />
            </div>
            <Widget_User_Items />
            <Widget_Feedback />
        </div>
        <Main_Footer />
    </div>
</template>
<script>
import Main_Header from '~/components/header/Main_Header.vue';
import Main_Footer from '~/components/footer/Main_Footer.vue';
import Widget_User_Card from '~/components/user/Widget_User_Card.vue';
import Widget_User_Favorites from '~/components/user/Widget_User_Favorites.vue';
import Widget_User_Rating from '~/components/user/Widget_User_Rating.vue';
import Widget_User_Reviews from '~/components/user/Widget_User_Reviews.vue';
import Widget_User_Items from '~/components/user/Widget_User_Items.vue';

import Widget_Feedback from '~/components/feedback/Widget_Feedback.vue';

export default {
    components: { Main_Header, Main_Footer, Widget_User_Card, Widget_User_Favorites, Widget_User_Rating, Widget_User_Reviews, Widget_Feedback, Widget_User_Items },
}
</script>