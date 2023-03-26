<!-- Widget: Link to data (Subscan) -->
<!-- Links to current creator on another projects (Sub.ID, Explorer, etc) -->
<!-- Wiki:  -->
<template>
    <div class="widget-row-1">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-openon.svg">Open on...</div>
            </div>
            <div class="widget-content">
                <a class="open-on-link" :href="subIDLink" target="_blank">SubID</a>
                <a class="open-on-link" :href="subscanLink" target="_blank">Subscan</a>
            </div>
        </div>
    </div>
</template>
<script>
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
    name: 'Widget_Creator_Links',

    setup() {
        const route = useRoute();
        const subIDLink = computed(() => {
            return `https://sub.id/${route.params.id}`;
        });

        const subscanLink = computed(() => {
            return `https://kusama.subscan.io/account/${route.params.id}`;
        });

        return {
            subIDLink,
            subscanLink
        };
    }
}
</script>