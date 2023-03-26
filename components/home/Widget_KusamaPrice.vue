<!-- Widget: Kusama Price -->
<!-- Shows current Kusama price in different currencies with simple price chart -->
<!-- Wiki:  -->
<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><img src="@/static/images/icons/icon-price.svg">Kusama Price</div>
        </div>
        <div class="widget-content">
            <div v-if="isLoading" class="widget-content-placeholder"></div>
            <div v-else>
                <div class="widget-kusama-price-value">{{ kusamaPrice }} $</div>
                <div class="widget-kusama-price-graph">
                    <canvas ref="chartRef"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js/auto';

const config = useRuntimeConfig()

export default {

    name: 'Widget_KusamaPrice',

    setup() {
        const kusamaPrice = ref(null);
        const chartData = ref(null);
        const chartRef = ref(null);
        const chartInstance = ref(null);
        const isLoading = ref(true);

        async function fetchData() {
            isLoading.value = true;
            try {
                const response = await fetch(config.api + '/getKusamaPrice/USD');
                const data = await response.json();
                const coin = data.coin;
                const price = parseFloat(coin.price).toFixed(2);
                kusamaPrice.value = price;

                const priceChanges = [
                    { label: '1 week', value: coin.priceChange1w },
                    { label: '1 day', value: coin.priceChange1d },
                    { label: '1 hour', value: coin.priceChange1h },
                ];

                chartData.value = {
                    labels: priceChanges.map(change => change.label),
                    datasets: [{
                        label: 'Price Changes',
                        data: priceChanges.map(change => change.value),
                        fill: true,
                        borderColor: 'rgb(216, 1, 115)',
                        backgroundColor: 'rgba(0,0,0,0)',
                        tension: 0.1,
                    }, ],
                };

                if (chartRef.value) {
                    renderChart(chartRef.value, chartData);
                }
            } catch (error) {
                console.error('Error fetching Kusama price data:', error);
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
            kusamaPrice,
            chartRef,
            chartData,
            isLoading,
        };
    },

};
</script>