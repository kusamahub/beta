<!-- Widget: Link to Market (Singular) -->
<!-- Links for collection on another projects (Singular, Explorer and etc.) -->
<!-- Wiki:  -->
<template>
    <div class="widget-row-1">
        <div class="widget">
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-openon.svg">Open on...</div>
            </div>
            <div class="widget-content">
                <a class="open-on-link" :href="singularLink" target="_blank">Singular</a>
                <a class="open-on-link" :href="kodadotLink" target="_blank">Kodadot</a>
            </div>
        </div>
    </div>
</template>
<script>
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
    name: 'Widget_Collection_SingularLink',

    setup() {
        const route = useRoute();
        const singularLink = computed(() => {
            return `https://singular.app/collectibles/kusama/${route.params.id}`;
        });

        const kodadotLink = computed(() => {
            return `https://kodadot.xyz/rmrk/collection/${route.params.id}`;
        });

        return {
            singularLink,
            kodadotLink
        };
    }
}
</script>