<!-- Page: Team -->
<!-- KusamaHub Team with contact info -->
<!-- Wiki:  -->
<template>
    <div>
        <Main_Header />
        <div class="content">
            <div class="widget-row-1">
                <div class="widget">
                    <div class="widget-header">
                        <div class="widget-title"><img src="@/static/images/icons/icon-team.svg">Team</div>
                    </div>
                    <div class="widget-content">
                        <div v-if="teamMembers === null" class="widget-content-placeholder"></div>
                        <div v-else class="team-grid">
                            <div class="team-member-card" v-for="team in teamMembers" :key="team.member_id">
                                <div class="team-card-image">
                                    <img src="@/static/img_placeholder.svg" />
                                </div>
                                <div class="team-card-meta">
                                    <div class="team-card-name">{{ team.member_name }}</div>
                                    <div class="team-card-role">{{ team.member_position }}</div>
                                    <div class="team-card-descr">{{ team.member_description }}</div>
                                    <a :href="`mailto:${ team.member_email }`">
                                        <div class="team-card-email">{{ team.member_email }}</div>
                                    </a>
                                </div>
                            </div>
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

    name: "Team_Page",
    components: { Main_Header, Main_Footer, Widget_Feedback },

    data() {
        return {
            teamMembers: null,
        }

    },

    mounted() {

        fetch(config.api + '/getTeam')
            .then((response) => response.json())
            .then((data) => {
                this.teamMembers = data
            });
    }

}
</script>