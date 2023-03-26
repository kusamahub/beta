<!-- Widget: Collection Calendar -->
<!-- Show calenadar events, where Collection ID is host of event / guest of event -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><img src="@/static/images/icons/icon-calendar.svg">Calendar</div>
        </div>
        <div class="widget-content widget-scrollable">
            <div v-if="calendarEvents === null" class="widget-content-placeholder"></div>
            <div v-else>
                <template v-if="calendarEvents.length > 0">
                    <div class="calendar-events">
                        <div class="calendar-event" v-for="event in calendarEvents" :key="event.event_id">
                            <div class="calendar-event-name">{{ event.event_title }}</div>
                            <div class="calendar-event-date">{{ event.event_start_time }} - {{ event.event_end_time }}</div>
                            <div class="calendar-event-date">{{ event.event_description }}</div>
                            <div class="calendar-event-date">{{ event.event_link }}</div>
                            <div class="calendar-event-date">{{ event.event_host }}</div>
                            <div class="calendar-event-date">{{ event.event_guests }}</div>
                            <div class="calendar-event-date">{{ event.event_type }}</div>
                            <div class="calendar-event-date">{{ event.event_collection }}</div>
                            <div class="calendar-event-date">{{ event.event_creator }}</div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="widget-no-content">No events yet 😕</div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
    name: 'Widget_Collection_Calendar',

    setup() {
        const calendarEvents = ref(null);
        const route = useRoute();
        const config = useRuntimeConfig();

        const walletAddress = ref(localStorage.getItem('user_wallet') || '');
        const walletName = ref(localStorage.getItem('user_name') || '');
        const isCreator = ref(localStorage.getItem('is_creator') === 'true');
        const isCreatorComputed = computed(() => isCreator.value);
        const isCreatorCollection = ref(false);
        const walletAddressComputed = computed(() => walletAddress.value);

        onMounted(async () => {
            try {
                const response = await fetch(config.api + '/getCollectionCalendarEvents/' + route.params.id);
                const data = await response.json();
                calendarEvents.value = data;
            } catch (error) {
                console.error('Failed to fetch calendar events:', error);
            }
        });

        const nuxtApp = useNuxtApp();
        const checkCreator = async () => {
            const storedWalletAddress = localStorage.getItem('user_wallet');
            if (storedWalletAddress) {
                const isConnected = await nuxtApp.checkConnect();
                if (!isConnected) {
                    localStorage.removeItem('user_wallet');
                    localStorage.removeItem('user_name');
                    walletAddress.value = '';
                    walletName.value = '';
                    localStorage.removeItem('is_creator');
                    isCreator.value = false;
                } else {
                    const creatorStatus = await nuxtApp.checkCreator(walletAddress.value);
                    isCreator.value = creatorStatus;
                    localStorage.setItem('is_creator', creatorStatus);
                }
            } else {

            }
        };


        async function checkCreatorCollections() {
            try {
                const response = await fetch(`${config.api}/getCreatorCollectionsIds/${walletAddress.value}`);
                const data = await response.json();

                if (data && data.collections) {
                    const found = data.collections.some((collection) => collection.id === route.params.id);
                    isCreatorCollection.value = found;
                }
            } catch (error) {
                console.error('Failed to fetch creator collections:', error);
            }
        }


        onMounted(async () => {
            await checkCreator();

            if (walletAddress.value) {
                await checkCreatorCollections();
            }

        });

        return {
            calendarEvents,
            isCreatorComputed,
            walletAddressComputed,
            isCreatorCollection
        };
    },
};
</script>