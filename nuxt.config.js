
export default defineNuxtConfig({

    app: {
        head: {
            charset: 'utf-8',
            title: 'KusamaHub',
            meta: [
                // <meta name="viewport" content="width=device-width, initial-scale=1">
                { name: 'viewport', content: 'viewport-fit=cover, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no' },
                { name: 'format-detection', content: 'telephone=no' },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
                { name: 'apple-mobile-web-app-title', content: 'KusamaHub' },
                { name: "description", content: "KusamaHub is a analytics tool and library for NFT projects and creators from Kusama blockchain" },
                { property: "og:type", content: "website" },
                { property: "og:url", content: "https://beta.kusamahub.com/" },
                { property: "og:title", content: "KusamaHub" },
                { property: "og:description", content: "KusamaHub is a analytics tool and library for NFT projects and creators from Kusama blockchain" },
                { property: "og:image", content: "/favicon/meta.jpg" },
                { property: "twitter:card", content: "summary_large_image" },
                { property: "twitter:url", content: "https://beta.kusamahub.com/" },
                { property: "twitter:title", content: "KusamaHub" },
                { property: "twitter:description", content: "KusamaHub is a analytics tool and library for NFT projects and creators from Kusama blockchain" },
                { property: "twitter:image", content: "/favicon/meta.jpg" },
            ],
            htmlAttrs: {
                lang: 'en'
            },
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
                { rel: 'manifest', href: '/favicon/site.webmanifest' },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-2048-2732.jpg", media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-2732-2048.jpg", media: "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1668-2388.jpg", media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-2388-1668.jpg", media: "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1536-2048.jpg", media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-2048-1536.jpg", media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1668-2224.jpg", media: "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-2224-1668.jpg", media: "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1620-2160.jpg", media: "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-2160-1620.jpg", media: "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1284-2778.jpg", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-2778-1284.jpg", media: "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1170-2532.jpg", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-2532-1170.jpg", media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1125-2436.jpg", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-2436-1125.jpg", media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1242-2688.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-2688-1242.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-828-1792.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1792-828.jpg", media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1242-2208.jpg", media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-2208-1242.jpg", media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-750-1334.jpg", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1334-750.jpg", media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-640-1136.jpg", media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" },
                { rel: "apple-touch-startup-image", href: "/splashscreens/apple-splash-1136-640.jpg", media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" },
            ],
        }
    },

    css: [
        '@/static/style.css',
        '@/static/styles/styles-calendar.css',
        '@/static/styles/styles-charts.css',
        '@/static/styles/styles-menus.css',
        '@/static/styles/styles-placeholders.css',
        '@/static/styles/styles-widgets.css',
        '@/static/styles/styles-dark-theme.css',
        '@/static/styles/styles-light-theme.css',
        '@/static/styles/styles-mobile.css',
    ],

    // plugins: [
    //     '@/plugins/shortenAddress.js'
    // ],

    runtimeConfig: {
        public: {
            api: process.env.API_BASE_TOKEN
        }
    },

    ssr: false,

    components: true,
    components: [
        { path: '~/node_modules/vue-simple-calendar', prefix: 'calendar' }
    ],

    build: {},

})