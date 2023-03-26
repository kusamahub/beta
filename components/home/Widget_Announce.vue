<!-- Widget: Announce -->
<!-- Shows important message from KusamaHub Team -->
<!-- Wiki:  -->
<template>
    <div class="widget-row-1">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-announce.svg">Announce</div>
            </div>
            <div class="widget-content">
                <div v-if="announceMessage === null" class="widget-content-placeholder"></div>
                <div v-else>{{ announceMessage }}</div>
            </div>
        </div>
    </div>
</template>
<script>
const config = useRuntimeConfig()

export default {

    name: 'Widget_Announce',

    data() {
        return {
            announceMessage: null,
        }
    },

    mounted() {

        fetch(config.api + '/getAnnounce')
            .then((response) => response.json())
            .then((data) => {
                const message = data[0].announce_message;
                return this.announceMessage = message
            });

    },

}
</script>