<!-- Widget: Collection Chart - Floor Price -->
<!-- Chart with collection's floor price -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><img src="@/static/images/icons/icon-chart.svg">Volume</div>
        </div>
        <div class="widget-content">
            <div v-if="isLoading" class="widget-content-placeholder"></div>
            <div v-else class="chart-container">
                <canvas ref="chartRef"></canvas>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js/auto';

export default {
    name: 'Widget_Collection_Graph_MostAvarage',

    setup() {
        const config = useRuntimeConfig();
        const route = useRoute();
        const chartData = ref(null);
        const chartRef = ref(null);
        const chartInstance = ref(null);
        const isLoading = ref(true);

        async function fetchData() {
            isLoading.value = true;
            try {
                const response = await fetch(
                    `${config.api}/getCollectionStats/${route.params.id}`
                );
                const data = await response.json();
                const createdDate = new Date(data.created);
                const lastUpdateDate = new Date(data.last_update);
                const volumeAll = data.singular_stats.volume.all;

                chartData.value = {
                    labels: [createdDate, lastUpdateDate],
                    datasets: [{
                        label: 'Volume',
                        data: [0, volumeAll],
                        fill: true,
                        borderColor: 'rgb(72, 106, 255)',
                        tension: 0.1,
                    }, ],
                };

                if (chartRef.value) {
                    renderChart(chartRef.value, chartData.value);
                }
            } catch (error) {
                console.error('Error fetching collection stats:', error);
            } finally {
                isLoading.value = false;
            }
        }

        function renderChart(chartElement, chartData) {
            if (chartInstance.value) {
                chartInstance.value.destroy();
            }

            const ctx = chartElement.getContext('2d');
            chartInstance.value = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    scales: {
                        y: { display: false },
                        x: { display: false },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });
        }

        onMounted(async () => {
            await fetchData();
            if (chartRef.value) {
                renderChart(chartRef.value, chartData.value);
            }
        });

        return {
            chartRef,
            chartData,
            isLoading
        };
    },
};
</script>