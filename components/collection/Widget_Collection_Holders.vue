<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title">
                <img src="@/static/images/icons/icon-holders.svg" />Holders
            </div>
            <div class="widget-filters">
                <div class="widget-filters-filter" :class="{ 'active': selectedList === 'amount_list' }" @click="selectList('amount_list')">
                    Distribution
                </div>
                <div class="widget-filters-filter" :class="{ 'active': selectedList === 'holders_list' }" @click="selectList('holders_list')">
                    Holders
                </div>
            </div>
            <div class="widget-button" @click="downloadCSV">
                <span class="material-icons">file_download</span>
            </div>
        </div>
        <div v-if="isLoading" class="widget-content-placeholder"></div>
        <div v-else class="widget-scrollable-holders">
            <table>
                <tr>
                    <th v-if="selectedList === 'amount_list'">Holder</th>
                    <th v-else>NFT ID</th>
                    <th :style="{ 'text-align': selectedList === 'amount_list' ? 'center' : 'left' }">
                        {{ selectedList === 'amount_list' ? 'Amount' : 'Holder' }}
                    </th>
                </tr>
                <tr v-for="item in displayedData" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td :style="{ 'text-align': selectedList === 'amount_list' ? 'center' : 'left' }">
                        {{ item.data }}
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
    name: 'Widget_Collection_Items',

    setup() {
        const route = useRoute();
        const config = useRuntimeConfig();
        const isLoading = ref(false);
        const data = ref({
            holders_list: [],
            amount_list: [],
        });
        const selectedList = ref(localStorage.getItem('selectedList') || 'amount_list');

        const displayedData = computed(() => {
            return data.value[selectedList.value];
        });

        async function fetchData() {
            isLoading.value = true;
            try {
                const response = await fetch(config.api + '/getCollectionSnapshot/' + route.params.id);
                const jsonData = await response.json();
                data.value = jsonData;
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                isLoading.value = false;
            }
        }

        function selectList(filterName) {
            selectedList.value = filterName;
            localStorage.setItem('selectedList', filterName);
        }



        async function downloadCSV() {
            const collectionId = route.params.id;
            const csvData = convertToCSV(data.value);
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${collectionId}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }



        function convertToCSV(data) {
            const collectionId = route.params.id;
            const holdersListCSV =
                'NFT ID,Holder\n' +
                data.holders_list.map(({ id, data }) => `${id},${data}`).join('\n');
            const amountListCSV =
                'Holder,Amount\n' +
                data.amount_list.map(({ id, data }) => `${id},${data}`).join('\n');

            return `Collection ID: ${collectionId}\n\n${holdersListCSV}\n\n${amountListCSV}`;
        }


        onMounted(async () => {
            await fetchData();
        });

        return {
            isLoading,
            displayedData,
            selectedList,
            selectList,
            downloadCSV
        };
    },
};
</script>