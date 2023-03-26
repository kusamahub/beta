<template>
    <div class="widget">
        <div class="widget-header">
            <div class="widget-title">
                <img src="@/static/images/icons/icon-vote.svg" />Vote
            </div>
        </div>
        <div class="widget-content">
            <div class="votes-container">
                <div :class="['vote-up', voteUpVoted ? 'vote-up-voted' : '']" @click="vote('vote_up')">
                    <div class="vote-symbol">👍</div>
                    <div class="vote-text">Like it!</div>
                </div>
                <div :class="['vote-down', voteDownVoted ? 'vote-down-voted' : '']" @click="vote('vote_down')">
                    <div class="vote-symbol">👎</div>
                    <div class="vote-text">Don't like!</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';


export default {
    name: 'Widget_Collection_User_Rating_Vote',
    setup() {
        const route = useRoute();
        const walletAddress = ref(localStorage.getItem('user_wallet') || '');
        const userVote = ref('');
        const userRating = ref(null);
        const voteUpVoted = ref(false);
        const voteDownVoted = ref(false);
        const collectionId = ref(route.params.id);
        const isCreatorCollection = ref(false);
        const isCreator = ref(false);

        const config = useRuntimeConfig();
        const nuxtApp = useNuxtApp();



        // Get User rating for this collection
        async function getUserRating() {
            try {
                const response = await fetch(`${config.api}/getUserRatingForCollection/${walletAddress.value}/${collectionId.value}`);
                const data = await response.json();

                if (data && data.length > 0 && data[0].user_rating) {
                    userRating.value = data[0].user_rating;
                    voteUpVoted.value = data[0].user_rating === 'vote_up';
                    voteDownVoted.value = data[0].user_rating === 'vote_down';
                }
            } catch (error) {
                console.error('Failed to fetch user rating:', error);
            }
        }



        // Vote
        async function vote(rating) {
            await checkConnection();

            if (!walletAddress.value) {
                alert('Please, login');
                return;
            }

            await checkCreatorCollections();

            if (isCreatorCollection.value) {
                alert("You can't set a rating for your collection");
                return;
            }

            const signedResult = await signMessage();
            if (!signedResult) {
                return;
            }

            await updateUserRating(rating);
        }




        // Handle user rating
        async function updateUserRating(rating) {
            try {
                const authToken = localStorage.getItem('auth_token');
                const response = await fetch(`${config.api}/updateUserRatingForCollection`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        collection_id: collectionId.value,
                        user_id: walletAddress.value,
                        user_rating: rating,
                    }),
                });

                if (response.ok) {
                    userRating.value = rating;
                    voteUpVoted.value = rating === 'vote_up';
                    voteDownVoted.value = rating === 'vote_down';

                    localStorage.removeItem('auth_token');
                    location.reload()
                } else {
                    console.error('Failed to update user rating. Server response:', await response.text());
                }
            } catch (error) {
                console.error('Failed to update user rating:', error);
            }
        }


        // Check wallet connection
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


        // Check if collection belongs to Creator
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


        // Sign message for access API
        async function signMessage() {
            try {
                const message = 'To update rating you need to sign this message.';
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


        // On load events
        onMounted(async () => {
            if (walletAddress.value) {
                await getUserRating();
            }
        });

        // Returns
        return {
            userVote,
            vote,
            voteUpVoted,
            voteDownVoted
        };
    },
}
</script>