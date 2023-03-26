<!-- Feedback Widget -->
<!-- Used only in dev/beta environments to receive feedback from users. Must be disabled on release -->
<!-- Wiki: -->
<template>
    <div class="widget-row-1">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-feedback.svg">Feedback Assistant</div>
                <div @click="openNewFeedbackWindow" class="widget-button"><span class="material-icons">maps_ugc</span></div>
            </div>
            <div class="widget-content">
                Report issues and give us suggestions for improvements!
            </div>
        </div>
    </div>
    <div class="app-window-background" v-if="newFeedbackStart">
        <div class="app-window" ref="feedbackWindow">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-feedback.svg">Feedback Assistant</div>
                <div @click="newFeedbackStart = false" class="widget-button"><span class="material-icons">close</span></div>
            </div>
            <div class="widget-content widget-scrollable-window">
                <div v-if="!feedbackSent">
                    <div class="feedback-assistant-info">
                        <div class="feedback-assistant-symbol">👩‍💻</div>
                        <div class="feedback-assistant-title">Welcome to Feedback Assistant!</div>
                        <div class="feedback-assistant-text">
                            Here you can report an issue or give us suggestions for improvements.<br>
                            You can also report an issue or send a suggestion to our email address:<br>
                            <div class="email-link">feedback@kusamahub.com</div>
                            <div v-if="showEmptyMessage" class="feeback-error-msg"> Please, describe in few words issue or suggestion </div>
                            <div v-if="showErrorMessage" class="feeback-error-msg"> Something went wrong, please, send email </div>
                        </div>
                    </div>
                    <div>
                        <input v-model="email" id="email" type="text" placeholder="Email, if you want to receive feedback">
                    </div>
                    <div>
                        <textarea v-model="message" id="message" placeholder="Describe a problem or suggestion"></textarea>
                    </div>
                    <div>
                        <div tabindex="0" :class="{'window-button': true, 'disabled': isSubmitting}" @click="sendFeedback" :disabled="isSubmitting">Submit</div>
                    </div>
                </div>
                <div v-else>
                    <div class="feedback-assistant-info">
                        <div class="feedback-assistant-symbol">👩‍💻</div>
                        <div class="feedback-assistant-title">Feedback sent!</div>
                        <div class="feedback-assistant-text">
                            Thank you for your feedback!<br>
                            We will review it and give your feedback via email. You can close this window, or wait 5 seconds, then it close automaticaly.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const config = useRuntimeConfig()

export default {
    name: 'Widget_Feedback',

    data() {
        return {
            isSubmitting: false,
            newFeedbackStart: false,
            feedbackSent: false,
            showEmptyMessage: false,
            showErrorMessage: false,
            email: '',
            message: '',
        }
    },

    methods: {
        openNewFeedbackWindow() {
            this.newFeedbackStart = true
        },

        async sendFeedback() {
            if (!this.message) {
                this.showEmptyMessage = true;
                setTimeout(() => {
                    this.showEmptyMessage = false;
                }, 5000);
                return;
            }

            this.isSubmitting = true;

            const response = await fetch(config.api + '/sendFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'feedback_user_email': this.email,
                    'feedback_message': this.message,
                    'feedback_user_id': localStorage.getItem('user_wallet'),
                    'feedback_page': this.$route.name
                })
            });
            if (response.status === 200) {
                this.feedbackSent = true;
                setTimeout(() => {
                    this.newFeedbackStart = false;
                    this.feedbackSent = false;
                    this.email = '';
                    this.message = '';
                }, 5000);
                const responseData = await response.json();
            } else {
                console.error('Error submitting feedback');
                this.showErrorMessage = true;
            }

        },

        closeModal() {
            this.newFeedbackStart = false
        }
    },

    mounted() {
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

        if (this.$refs.closeButton) {
            this.$refs.closeButton.addEventListener('click', event => {
                this.closeModal()
            })
        }
    },



    beforeDestroy() {
        document.removeEventListener('keydown', event => {
            if (event.key === 'Escape') {
                this.closeModal()
            }
        })
        this.$refs.feedbackWindow.removeEventListener('click', event => {
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