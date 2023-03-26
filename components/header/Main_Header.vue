<template>
    <client-only>
        <div class="header">
            <div class="header-container">
                <router-link to="/">
                    <div class="header-logo">
                        <div class="header-logo-image"><img src="@/static/kusamahub_logo_light.svg"></div>
                        <div class="header-status-image"><img src="@/static/beta_icon.svg"></div>
                    </div>
                </router-link>
                <div class="header-menu">
                    <div class="main-menu-button" ref="settingsMenuContainer" tabindex="0" @click="toggleMenu('settingsMenu')"><span class="material-icons">apps</span></div>
                    <div class="dropdown-menu" ref="settingsMenu" v-if="isMenuOpen('settingsMenu')">
                        <!-- Connect wallet -->
                        <div v-if="!walletAddress && !showAccountsList" @click="connectWallet" class="dropdown-menu-item"><span class="material-icons">person</span>Connect wallet</div>
                        <!-- Accounts list -->
                        <div v-if="showAccountsList" class="accounts-list">
                            <div @click="back" class="dropdown-menu-item"><span class="material-icons">arrow_back</span>Back</div>
                            <div class="dropdown-menu-item wallet-account-card" v-for="account in accounts" :key="account.walletAddress" @click="selectAccount(account)">
                                <div class="wallet-account-name">{{ account.walletName }}</div>
                                <div class="wallet-account-address">{{ account.walletAddress }}</div>
                            </div>
                        </div>
                        <!-- Connected wallet menu -->
                        <div v-else-if="walletAddress">
                            <!-- User page -->
                            <div class="dropdown-menu-item" @click="$router.push(`/user/${walletAddress}`)"><span class="material-icons">person</span>My Page</div>
                            <div v-if="isCreatorComputed" class="dropdown-menu-item" @click="$router.push(`/creator/${walletAddress}`)"><span class="material-icons">sentiment_very_satisfied</span>Creator Page</div>
                            <!-- Change wallet -->
                            <div class="dropdown-menu-item" @click="changeWallet">
                                <div class="wallet-account-name"><span class="material-icons">wallet</span>Wallet</div>
                                <div class="wallet-connected-account"><span class="material-icons">wallet</span><span class="wallet-connected-account-w">{{ walletShortAddress }}</span></div>
                            </div>
                            <!-- Logout -->
                            <div class="dropdown-menu-item" @click="Logout"><span class="material-icons">logout</span>Log out</div>
                        </div>
                        <!-- Support -->
                        <a href="https://discord.gg/VJ7JwufVQN" target="_blank">
                            <div class="dropdown-menu-item"><span class="material-icons">help_outline</span>Support</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </client-only>
</template>
<script>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';


export default {
    name: 'Main_Header',
    setup() {
        const openMenu = ref(null);
        const walletAddress = ref(localStorage.getItem('user_wallet') || '');
        const walletName = ref(localStorage.getItem('user_name') || '');
        const showAccountsList = ref(false);
        const accounts = ref([]);
        const isCreator = ref(localStorage.getItem('is_creator') === 'true');
        const isCreatorComputed = computed(() => isCreator.value);
        const settingsMenuContainer = ref(null);
        const settingsMenu = ref(null);

        const config = useRuntimeConfig();

        // Menu functions:
        const toggleMenu = (menuName) => {
            openMenu.value = openMenu.value === menuName ? null : menuName;
        };

        const isMenuOpen = (menuName) => {
            return openMenu.value === menuName;
        };

        // const handleOutsideClick = () => {

        // };

        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                openMenu.value = null;
            }
        };

        const back = () => {
            showAccountsList.value = false;
        };

        // Wallet connect functions:

        // Short address:
        const nuxtApp = useNuxtApp();
        const walletShortAddress = computed(() => {
            return walletAddress.value ? nuxtApp.shortenAddress(walletAddress.value) : '';
        });

        // Connect Wallet:
        const connectWallet = async () => {
            try {
                accounts.value = await nuxtApp.getWallets();
                showAccountsList.value = true;
            } catch (error) {
                alert(error.message);
            }
        };

        // Logout (Disconnect)
        const Logout = async () => {
            localStorage.removeItem('user_wallet');
            localStorage.removeItem('user_name');
            walletAddress.value = '';
            walletName.value = '';
            showAccountsList.value = false;
            localStorage.removeItem('is_creator');
            isCreator.value = false;
            localStorage.removeItem('auth_token');

            location.reload();
        };

        // Change wallet:
        const changeWallet = async () => {
            try {
                await nuxtApp.checkConnect();
            } catch (error) {
                alert(error.message);
                return;
            }

            accounts.value = await nuxtApp.getWallets();
            showAccountsList.value = true;
        };


        // List of accounts:
        async function selectAccount(account) {
            try {
                await nuxtApp.checkConnect();
                walletAddress.value = account.walletAddress;
                walletName.value = account.walletName;
                localStorage.setItem('user_wallet', walletAddress.value);
                localStorage.setItem('user_name', walletName.value);
                showAccountsList.value = false;

                // Check if the selected wallet is a creator
                const creatorStatus = await nuxtApp.checkCreator(walletAddress.value);
                isCreator.value = creatorStatus;
                localStorage.setItem('is_creator', creatorStatus);

                location.reload();
            } catch (error) {
                alert(error.message);
            }
        }


        // Check connection
        const checkConnection = async () => {
            const storedWalletAddress = localStorage.getItem('user_wallet');
            if (storedWalletAddress) {

                const isConnected = await nuxtApp.checkConnect();
                if (!isConnected) {
                    localStorage.removeItem('user_wallet');
                    localStorage.removeItem('user_name');
                    walletAddress.value = '';
                    walletName.value = '';
                    showAccountsList.value = false;
                    localStorage.removeItem('is_creator');
                    isCreator.value = false;
                } else {
                    const creatorStatus = await nuxtApp.checkCreator(walletAddress.value);
                    isCreator.value = creatorStatus;
                    localStorage.setItem('is_creator', creatorStatus);
                }
            } else {

            }
        };


        // On Load connection wallet check
        onMounted(async () => {
            await checkConnection();
            document.addEventListener('keydown', handleEscKey);
        });

        onBeforeUnmount(() => {
            document.removeEventListener('keydown', handleEscKey);
        });


        return {
            openMenu,
            walletAddress,
            walletName,
            showAccountsList,
            accounts,
            toggleMenu,
            isMenuOpen,
            connectWallet,
            selectAccount,
            checkConnection,
            isCreatorComputed,
            Logout,
            walletShortAddress,
            changeWallet,
            back,
        };
    },
};
</script>