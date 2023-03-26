<!-- Page: Calendar -->
<!-- Calendar with all events on KusamaHub and Kusama Blockchain -->
<!-- Wiki:  -->
<template>
    <div>
        <Main_Header />
        <div class="content">
            <div class="widget-row-1">
                <div class="widget">
                    <calendar-view :startingDayOfWeek="1" :show-date="showDate" currentPeriodLabel="today" :items="events" class="theme-default styles-calendar">
                        <template #header="{ headerProps }">
                            <div class="widget-header-calendar">
                                <div class="widget-title"><img src="@/static/images/icons/icon-calendar.svg">Calendar</div>
                                <calendar-view-header :header-props="headerProps" previousYearLabel="keyboard_double_arrow_left" previousPeriodLabel="keyboard_arrow_left" nextPeriodLabel="keyboard_arrow_right" nextYearLabel="keyboard_double_arrow_right" @input="setShowDate" />
                            </div>
                        </template>
                        <div class="widget-content"></div>
                    </calendar-view>
                </div>
            </div>
            <Widget_Feedback />
        </div>
        <Main_Footer />
    </div>
    <div class="app-window-background" v-if="modalEvent">
        <div class="app-window" ref="modalEventWindow">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-calendar.svg">Event name</div>
                <div @click="modalEvent = false" class="widget-button"><span class="material-icons">close</span></div>
            </div>
            <div class="widget-content">
                content of event
            </div>
        </div>
    </div>
</template>
<script>
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar';
import "~/node_modules/vue-simple-calendar/dist/style.css";
import "@/static/styles/styles-calendar.css";

import Main_Header from '~/components/header/Main_Header.vue';
import Main_Footer from '~/components/footer/Main_Footer.vue';

import Widget_Feedback from '~/components/feedback/Widget_Feedback.vue';

const config = useRuntimeConfig()

export default {
    components: { Main_Header, Main_Footer, Widget_Feedback, CalendarView, CalendarViewHeader },

    data() {
        return {
            calendarEvents: null,
            showDate: new Date(),
            events: [],

            modalEvent: false,
        }
    },

    mounted() {

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

        thisMonth(d, h, m) {
            const t = new Date()
            return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
        },

        setShowDate(d) {
            this.showDate = d;
        },

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

}
</script>