<!-- Widget: User Card -->
<!-- Contains current user basic info (address, Kusama Avatar, Kusama name and etc) -->
<!-- Wiki:  -->
<template>
    <div class="widget-row-1">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-user.svg">User</div>
            </div>
            <div class="widget-content">
                <div class="user-card">
                    <div class="user-card-image">
                        <img src="@/static/user_placeholder.svg">
                    </div>
                    <div class="user-card-data">
                        <div class="user-card-name">Username</div>
                        <div class="user-card-creator">{{ userID }}</div>
                        <div v-if="isUser" class="user-card-creator">It's you 😊</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Widget_User_Card',

    data() {
        return {
            userID: null,
        }
    },

    mounted() {
        this.userID = this.$route.params.id
    }

}
</script>