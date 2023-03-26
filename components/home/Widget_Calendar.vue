<!-- Widget: Calendar -->
<!-- Main calendar widget, which contains all events from KusamaHub for current date with 3 priority -->
<!-- Wiki:  -->
<template>
    <div class="widget-row-1">
        <div class="widget">
            <div class="widget-header">
                <router-link to="/calendar">
                    <div class="widget-title"><img src="@/static/images/icons/icon-calendar.svg">Calendar</div>
                </router-link>
                <div class="widget-button">{{ currentDate }}</div>
            </div>
            <div class="widget-content">
                <div v-if="calendarEvents === null" class="widget-content-placeholder"></div>
                <div v-else>
                    <div v-if="calendarEvents.length > 0">
                        <div class="calendar-events-home">
                            <div class="calendar-event" @click="openEventWindow" v-for="event in calendarEvents" :key="event.event_id">
                                <div class="calendar-event-name">{{ event.event_title }}</div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="widget-no-content">No events yet 😕</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="app-window-background" v-if="modalEvent">
        <div class="app-window" ref="modalEventWindow" v-for="event in calendarEvents" :key="event.event_id">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-calendar.svg">{{ event.event_title }}</div>
                <div @click="modalEvent = false" class="widget-button"><span class="material-icons">close</span></div>
            </div>
            <div class="widget-content">
                <div class="calendar-event-date">{{ event.event_description }}</div>
            </div>
        </div>
    </div>
</template>
<script>
const config = useRuntimeConfig()

export default {
    name: 'Widget_Calendar',

    data() {
        return {
            calendarEvents: null,
            currentDate: null,

            modalEvent: false,
        }

    },

    mounted() {

        this.currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

        fetch(config.api + '/getCalendarEvents')
            .then((response) => response.json())
            .then((data) => {
                this.calendarEvents = data;
            });


        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                this.closeModal()
            }
        })

        if (this.$refs.feedbackWindow) {
            this.$refs.feedbackWindow.addEventListener('click', event => {
                if (event.target.classList.contains('app-window-background')) {
                    this.closeModal()
                }
            })
        }

    },

    methods: {
        openEventWindow() {
            this.modalEvent = true
        },

        closeModal() {
            this.modalEvent = false
        }
    },



    beforeDestroy() {
        document.removeEventListener('keydown', event => {
            if (event.key === 'Escape') {
                this.closeModal()
            }
        })
        this.$refs.modalEventWindow.removeEventListener('click', event => {
            if (event.target.classList.contains('app-window-background')) {
                this.closeModal()
            }
        })
        this.$refs.closeButton.removeEventListener('click', event => {
            this.closeModal()
        })
    },

    computed: {
        disabledClass() {
            return { disabled: this.isSubmitting };
        },
    }

}
</script>