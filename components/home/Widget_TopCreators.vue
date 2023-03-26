<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title">
                <img src="@/static/images/icons/icon-topcreators.svg" />Top creators
            </div>
            <div class="widget-menu-container">
                <div class="widget-menu">Last 24 hours</div>
            </div>
        </div>
        <div class="widget-content widget-scrollable">
            <div v-if="isLoading" class="widget-content-placeholder"></div>
            <div v-else>
                <router-link class="top-container" v-for="creator in creators" :key="creator.id" :to="`/creator/${creator.id}`">
                    <div class="top-card">
                        <div class="creator-card-mini">
                            <div class="creator-card-mini-image">
                                <img :src="imgPlaceholder" />
                            </div>
                            <div class="creator-card-mini-meta">
                                <div class="creator-card-mini-name">{{ creator.name }}</div>
                                <div class="creator-card-mini-address">{{ creator.shortAddress }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="top-info">
                        <div class="top-info-stats">{{ creator.count }}</div>
                        <div class="top-info-name">sales</div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import imgPlaceholder from '@/static/creator_placeholder.svg';

const config = useRuntimeConfig();

export default {
    name: 'Widget_TopCreators',

    setup() {
        const creators = ref([]);
        const isLoading = ref(false);
        const error = ref(null);

        async function fetchCreators() {
            isLoading.value = true;
            try {
                const response = await fetch(`${config.api}/getTopCreators`);
                const creatorsData = await response.json();

                creators.value = creatorsData.map(creatorData => {
                    const shortAddress = useNuxtApp().shortenAddress(creatorData.issuer);
                    const name = creatorData.name || 'Creator';
                    const count = creatorData.count

                    return {
                        id: creatorData.issuer,
                        shortAddress,
                        name,
                        count
                    };
                });
                error.value = null;
            } catch (e) {
                console.error(e);
                error.value = 'Failed to fetch creators';
            }
            isLoading.value = false;
        }

        async function fetchMetadataForCreator(creatorIssuer) {
            const metadataUrl = `${config.api}/getCreatorMetadata/${creatorIssuer}`;
            try {
                const response = await fetch(metadataUrl);
                const metadata = await response.json();
                const name = metadata.name || 'Creator';
                const address = metadata.address;

                return { address, name };
            } catch (e) {
                console.error(e);
                return { address: creatorIssuer, name: 'Creator' };
            }
        }

        onMounted(async () => {
            await fetchCreators();
        });

        return {
            creators,
            isLoading,
            error,
            imgPlaceholder,
        };
    },
};
</script>