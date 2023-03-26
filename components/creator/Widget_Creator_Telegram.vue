<!-- Widget: Telegram Posts -->
<!-- Shows latest Telegram posts from collections -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><img src="@/static/images/icons/icon-telegram.svg">Telegram</div>
            <div class="widget-button"><span class="material-icons">open_in_new</span></div>
        </div>
        <div class="widget-content widget-scrollable">
            <div class="widget-no-content">No posts yet 😕</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Widget_Collection_Telegram',
}
</script>