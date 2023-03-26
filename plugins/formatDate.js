export default defineNuxtPlugin(nuxtApp => {

    function formatDate(dateString) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${month}\n${year}`;
    }

    nuxtApp.formatDate = formatDate;
});