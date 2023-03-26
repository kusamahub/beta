<!-- Widget: Creator Calendar -->
<!-- Events from calendar where current creator is host or guest -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><img src="@/static/images/icons/icon-calendar.svg">Calendar</div>
        </div>
        <div class="widget-content">
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
const config = useRuntimeConfig()

export default {
    name: 'Widget_Creator_Calendar',

    data() {
        return {
            calendarEvents: null,
        }
    },

    mounted() {
        const route = useRoute();

        fetch(config.api + '/getCreatorCalendarEvents/' + route.params.id)
            .then((response) => response.json())
            .then((data) => {
                const calendarEvents = data;
                return this.calendarEvents = calendarEvents
            });
    },
}
</script>