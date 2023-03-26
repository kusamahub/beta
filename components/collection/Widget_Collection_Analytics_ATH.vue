<!-- Widget: Collection Chart - Floor Price -->
<!-- Chart with collection's floor price -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><img src="@/static/images/icons/icon-chart.svg">Price</div>
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
    name: 'Widget_Collection_Graph_ATH',

    setup() {
        const config = useRuntimeConfig();
        const route = useRoute();
        const chartData = ref(null);
        const chartRef = ref(null);
        const chartInstance = ref(null);
        const nuxtApp = useNuxtApp();
        const isLoading = ref(true);

        async function fetchData() {
            isLoading.value = true;
            try {
                const response = await fetch(
                    `${config.api}/getCollectionStats/${route.params.id}`
                );
                const data = await response.json();
                const minPrice = data.singular_stats.min;
                const maxPrice = data.singular_stats.max;
                const Average = data.singular_stats.avg;
                const Floor = nuxtApp.formatPrice(data.singular_stats.floor);

                chartData.value = {
                    labels: ['Min Price', 'Max Price', 'Average Price', 'Floor Price'],
                    datasets: [{
                        label: 'Price',
                        data: [minPrice, maxPrice, Average, Floor],
                        fill: true,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                        ],
                        // borderColor: 'rgb(0, 215, 0)',
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                        ],
                        borderWidth: 1,
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
                type: 'bar',
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