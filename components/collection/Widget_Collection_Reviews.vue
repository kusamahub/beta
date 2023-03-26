<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title"><img src="@/static/images/icons/icon-reviews.svg">Reviews</div>
            <div v-if="walletAddressComputed" @click="showWindow" class="widget-button"><span class="material-icons">add</span></div>
        </div>
        <div class="widget-content widget-scrollable-reviews">
            <div v-if="isLoading" class="widget-content-placeholder"></div>
            <div v-else>
                <div v-if="noReviews" class="widget-no-content">No reviews 😕</div>
                <div v-else>
                    <div class="review" v-for="review in sortedCollectionReviews" :key="review.review_id" @click="$router.push({ path: '/user/' + review.user_id })">
                        <div class="review-user">
                            <div class="review-user-photo">
                                <img :src='imgPlaceholder'>
                            </div>
                            <div class="review-user-data">
                                <div class="review-user-data-name">{{ review.userName }}</div>
                                <div class="review-user-data-wallet">{{ review.shortenAddress }}</div>
                            </div>
                        </div>
                        <div class="review-text">
                            {{ review.user_review }}
                        </div>
                        <div class="review-date">{{ review.formatedDate }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Add Review Window -->
    <div class="app-window-background" ref="appWindowBackground" v-if="reviewSendStart" @click="closeWindow">
        <div class="app-window" @click.stop>
            <div class="widget-header">
                <div class="widget-title"><img src="@/static/images/icons/icon-reviews.svg">Add new review</div>
                <div @click="reviewSendStart = false" class="widget-button"><span class="material-icons">close</span></div>
            </div>
            <div class="widget-content widget-scrollable-window">
                <div v-if="reviewStatus === 'idle'">
                    <div class="window-content">
                        <div class="window-content-symbol">✍️</div>
                        <div class="window-content-title">Add a Review</div>
                        <div class="window-content-text">
                            Reviews helps other people get more information about collection or creator.<br>
                            <div v-if="emptyMsgError" class="window-error-msg">Review can't be empty</div>
                            <div v-if="showSymbolLimitError" class="window-error-msg">500 symbols is max for review</div>
                            <div v-if="cancelSignMsg" class="window-error-msg">You need to sign transaction for publish or update review</div>
                        </div>
                    </div>
                    <div>
                        <textarea id="review_text" v-model="getUserReviewText" placeholder="What do you think?"></textarea>
                    </div>
                    <div>
                        <div :class="{'window-button': true, 'disabled': isSubmitting}" @click="sendReview" :disabled="isSubmitting">Publish</div>
                    </div>
                </div>
                <div v-if="reviewStatus === 'error'">
                    <div class="window-content">
                        <div class="window-content-symbol">❌</div>
                        <div class="window-content-title">You catch error</div>
                        <div class="window-content-text">
                            Something went wrong. Please, contact support<br>
                            <div class="email-link">feedback@kusamahub.com</div>
                        </div>
                    </div>
                    <div>
                        <div class="window-button" tabindex="0" @click="closeWindow">Close</div>
                    </div>
                </div>
                <div v-if="reviewStatus === 'complete'">
                    <div class="window-content">
                        <div class="window-content-symbol">✅</div>
                        <div class="window-content-title">Review added!</div>
                        <div class="window-content-text">
                            Window will close after 4 seconds<br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { onMounted, onUnmounted, ref } from 'vue';
import imgPlaceholder from '@/static/user_placeholder.svg';

export default {
    name: 'Widget_Collection_Reviews',

    setup() {
        const config = useRuntimeConfig();
        const route = useRoute();
        const isLoading = ref(true);
        const collectionReviews = ref([]);

        const collectionId = ref(route.params.id);
        const isCreatorCollection = ref(false);
        const walletAddress = ref(localStorage.getItem('user_wallet') || '');

        const appWindowBackground = ref(null);
        const reviewSendStart = ref(false);
        const reviewStatus = ref('idle');
        const showSymbolLimitError = ref(false);
        const cancelSignMsg = ref(false);
        const emptyMsgError = ref(false)
        const isSubmitting = ref(false);
        const getUserReviewText = ref('');

        const nuxtApp = useNuxtApp();



        // Reviews 

        const sortedCollectionReviews = computed(() => {
            return collectionReviews.value.slice().sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });
        });


        const fetchCollectionReviews = async () => {
            try {
                const response = await fetch(
                    config.api + '/getCollectionReviews/' + route.params.id
                );
                const data = await response.json();
                if (data.reviews === 0 || !Array.isArray(data)) {
                    collectionReviews.value = [];
                } else {
                    const extendedData = await Promise.all(
                        data.map(async (review) => {
                            let userName = "User";
                            try {
                                const metadataResponse = await fetch(
                                    config.api + '/getCreatorMetadata/' + review.user_id
                                );
                                const metadata = await metadataResponse.json();
                                if (metadata && metadata.name) {
                                    userName = metadata.name;
                                }
                            } catch (error) {
                                console.error('Error fetching creator metadata:', error);
                            }

                            return {
                                ...review,
                                userName,
                                shortenAddress: nuxtApp.shortenAddress(review.user_id),
                                formatedDate: nuxtApp.formatDateEx(review.created_at),
                            };
                        })
                    );
                    collectionReviews.value = extendedData;
                }
            } catch (error) {
                console.error('Error fetching collection reviews:', error);
            } finally {
                isLoading.value = false;
            }
        };

        const noReviews = computed(() => {
            return collectionReviews.value.length === 0;
        });





        // New review

        async function getUserReview() {
            try {
                const response = await fetch(`${config.api}/getUserReviewForCollection/${walletAddress.value}/${collectionId.value}`);
                const data = await response.json();

                if (data && data.length > 0 && data[0].user_id) {
                    getUserReviewText.value = data[0].user_review;
                }
            } catch (error) {
                console.error('Failed to fetch user review:', error);
            }
        }



        async function sendReview() {

            if (isSubmitting.value) return;

            const userReviewText = document.getElementById('review_text').value.trim();

            if (userReviewText.length > 500) {
                showSymbolLimitError.value = true;
                setTimeout(() => {
                    showSymbolLimitError.value = false;
                }, 4000);
                return;
            }

            if (userReviewText.length === 0) {
                emptyMsgError.value = true;
                setTimeout(() => {
                    emptyMsgError.value = false;
                }, 4000);
                return;
            }

            isSubmitting.value = true;
            showSymbolLimitError.value = false;

            await checkConnection();
            if (!walletAddressComputed.value) {
                alert('Please, login');
                isSubmitting.value = false;
                closeWindow();
                return;
            }


            await checkCreatorCollections();
            if (isCollectionCreator.value) {
                alert("You can't write a review for your collection");
                isSubmitting.value = false;
                closeWindow();
                return;
            }


            const signedResult = await signMessage();
            if (!signedResult) {
                reviewStatus.value = 'idle';
                cancelSignMsg.value = true;
                setTimeout(() => {
                    cancelSignMsg.value = false;
                }, 4000);
                isSubmitting.value = false;
                return;
            }

            const success = await sendReviewForCollection(userReviewText);
            if (success) {
                reviewStatus.value = 'complete';
                setTimeout(() => {
                    location.reload()
                }, 4000);
            } else {
                reviewStatus.value = 'error';
            }

            isSubmitting.value = false;
        }




        async function checkConnection() {
            try {
                const isConnected = await nuxtApp.checkConnect();
                if (!isConnected) {
                    localStorage.removeItem('user_wallet');
                    localStorage.removeItem('user_name');
                    walletAddress.value = '';
                    localStorage.removeItem('is_creator');
                }
            } catch (error) {
                console.error('Failed to check connection:', error);
            }
        }





        async function checkCreatorCollections() {
            try {
                const response = await fetch(`${config.api}/getCreatorCollectionsIds/${walletAddress.value}`);
                const data = await response.json();

                if (data && data.collections) {
                    const found = data.collections.some((collection) => collection.id === route.params.id);
                    isCreatorCollection.value = found;
                }
            } catch (error) {
                console.error('Failed to fetch creator collections:', error);
            }
        }





        async function signMessage() {
            try {
                const message = 'To publish or update a review you need to sign this message.';
                const signedResult = await nuxtApp.signMessage(walletAddress.value, message);

                if (!signedResult) {
                    return false;
                }

                const methodBody = {
                    walletAddress: walletAddress.value,
                    signedMessage: signedResult,
                    message: message,
                };

                const response = await fetch(config.api + '/api/generateToken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(methodBody),
                });

                if (response.ok) {
                    const data = await response.json();
                    const token = data.token;
                    localStorage.setItem('auth_token', token);
                } else {
                    console.error('Failed to generate JWT token. Server response:', await response.text());
                }

                return true;
            } catch (error) {
                alert(error.message);
                return false;
            }
        }





        async function sendReviewForCollection(userReviewText) {
            try {
                const authToken = localStorage.getItem('auth_token');
                const response = await fetch(`${config.api}/sendUserReviewForCollection`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        collection_id: collectionId.value,
                        user_id: walletAddress.value,
                        user_review: userReviewText,
                    }),
                });

                if (response.ok) {
                    localStorage.removeItem('auth_token');
                    return true;
                } else {
                    console.error('Failed to update user rating. Server response:', await response.text());
                    return false;
                }
            } catch (error) {
                console.error('Failed to update user rating:', error);
                return false;
            }
        }



        const walletAddressComputed = computed(() => {
            return walletAddress.value !== '';
        });

        const isCollectionCreator = computed(() => {
            return isCreatorCollection.value;
        });



        // Modal functions:

        function showWindow() {
            if (isCollectionCreator.value) {
                alert("You can't write a review for your collection");
                return;
            }
            reviewSendStart.value = true;
        }

        function closeWindow() {
            reviewSendStart.value = false;
        }

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                closeWindow();
            }
        };

        const onClick = (event) => {
            if (event.target.classList.contains('app-window-background')) {
                closeWindow();
            }
        };

        onMounted(async () => {
            if (walletAddress.value) {
                await checkCreatorCollections();
            }
            if (walletAddress.value) {
                await getUserReview();
            }
            fetchCollectionReviews();
            document.addEventListener('keydown', onKeyDown);
        });

        onUnmounted(() => {
            document.removeEventListener('keydown', onKeyDown);
        });





        return {
            isLoading,
            imgPlaceholder,
            collectionReviews,
            sortedCollectionReviews,
            appWindowBackground,
            noReviews,
            reviewSendStart,
            reviewStatus,
            showSymbolLimitError,
            showWindow,
            closeWindow,
            isSubmitting,
            walletAddressComputed,
            isCollectionCreator,
            emptyMsgError,
            sendReview,
            cancelSignMsg,
            getUserReviewText
        };
    },
};
</script>