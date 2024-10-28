<template>
    <div class="relative">
        <StartBackground />
        <div class="flex justify-center items-center text-center text-white w-full mt-24 mb-24">
            <div class="flex flex-col w-full md:w-1/2">
                <div class="flex flex-col items-center">
                    <img :src="userPhotoURL" :alt="userDisplayName"
                        class="w-36 h-36 mb-4 rounded-[50%] border-4 border-white">
                    <!-- Add edit button next to display name -->
                    <div class="flex items-center gap-2">
                        <h2 class="chalk-text text-2xl font-bold">{{ displayName.length > 12 ? displayName.slice(0,12) + '...' : displayName }}</h2>
                        <button @click="showEditNamePopup = true" class="p-1 hover:bg-white/20 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Add edit name popup -->
                <div v-if="showEditNamePopup"
                    class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div class="modal-content bg-gray-800 rounded-lg p-6 w-96">
                        <h3 class="text-white text-xl font-bold mb-4">Edit Display Name</h3>
                        <input 
                            type="text" 
                            v-model="newDisplayName"
                            maxlength="12"
                            class="w-full p-2 mb-4 rounded bg-gray-700 text-white" 
                            placeholder="Enter new display name">
                        <div class="flex justify-end gap-2">
                            <button @click="showEditNamePopup = false" class="px-4 py-2  text-white ">
                                Cancel
                            </button>
                            <button @click="updateDisplayName"
                                class="px-4 py-2 bg-gradient-spin text-white rounded-full transition-all duration-300 hover:scale-105">
                                Save
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-center py-4 mt-12 bg-gradient-spin rounded-2xl mx-4 sm:mx-0">
                    <p class="text-lg text-white mt-4">Total Score</p>
                    <h1 class="text-6xl font-bold text-white mb-4">{{ totalScore }}</h1>
                    <div
                        class="grid grid-cols-3 gap-4 mm:gap-12 ms:gap-8 sm:gap-12 mx-4 sm:w-full h-32 justify-center items-stretch text-white relative">
                        <div class="flex flex-col justify-between items-center py-4">
                            <img src="@/assets/images/badge.webp" alt="Tic Tac Toe" class="w-12 h-12 rounded-2xl p-2 bg-white/20">
                            <p class=" text-sm">Wins</p>
                            <h4 class="text-2xl font-bold ">{{ playerStats.wins }}</h4>
                        </div>
                        <div class="flex flex-col justify-between items-center py-4">
                            <img src="@/assets/images/emoji.webp" alt="Tic Tac Toe" class="w-12 h-12 rounded-2xl p-2 bg-white/20">
                            <p class=" ">Losses</p>
                            <h4 class="text-2xl font-bold ">{{ playerStats.losses }}</h4>
                        </div>
                        <div class="flex flex-col justify-between items-center py-4">
                            <img src="@/assets/images/balance.webp" alt="Tic Tac Toe" class="w-12 h-12 rounded-2xl p-2 bg-white/20">
                            <p class=" ">Draws</p>
                            <h4 class="text-2xl font-bold ">{{ playerStats.draws }}</h4>
                        </div>
                    </div>
                </div>

                <div class="mt-12">
                    <div class="flex-row flex w-full justify-center items-center">
                        <hr class="w-full">
                        <div class="bg-white rounded-2xl p-4">
                            <h3 class="text-2xl font-bold text-black">Achievements</h3>
                        </div>
                        <hr class="w-full">
                    </div>
                    <ul class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-4 sm:mx-0">
                        <li v-for="achievement in allAchievements" :key="achievement.name"
                            :class="['rounded-2xl p-4', achievement.achieved ? 'bg-gradient-spin text-white' : 'bg-gray-700 text-white']">
                            <div class="flex flex-col items-center justify-between mb-2">
                                <img v-if="achievement.icon" :src="getAchievementIcon(achievement.icon)"
                                    :alt="achievement.name" class="w-16 h-16 my-4">
                                <h2 class="text-xl font-bold">{{ achievement.name }}</h2>
                            </div>
                            <p class="text-sm mt-2">{{ achievement.description }}</p>
                            <div class="my-4">
                                <span v-if="achievement.achieved"
                                    class="text-green-600 font-semibold bg-white rounded-full p-2">Achieved</span>
                                <span v-else class="text-red-500 font-semibold">Not Achieved</span>
                            </div>
                            <small v-if="achievement.achieved && achievement.dateAchieved" class="mt-2">
                                Achieved on: {{ new Date(achievement.dateAchieved).toLocaleDateString() }}
                            </small>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { auth, db, onAuthStateChanged } from '@/core/plugins/firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { checkAchievements } from '@/core/services/achievements';
import StartBackground from '../bg/StarBackground.vue';
const user = ref(auth.currentUser);
const defaultAvatar = '/assets/images/cat.webp'; // Make sure this path is correct
const displayName = ref('');
const playerStats = ref({
    wins: 0,
    losses: 0,
    draws: 0
});

const userPhotoURL = ref(defaultAvatar);

const userDisplayName = computed(() => user.value?.displayName || 'Anonymous Player');

const fetchUserPhoto = async () => {
    if (user.value?.photoURL) {
        try {
            const response = await fetch(user.value.photoURL);
            if (response.ok) {
                userPhotoURL.value = user.value.photoURL;
            } else {
                userPhotoURL.value = defaultAvatar;
            }
        } catch (error) {
            console.error('Error fetching user photo:', error);
            userPhotoURL.value = defaultAvatar;
        }
    } else {
        userPhotoURL.value = defaultAvatar;
    }
};

const fetchDisplayName = async (userId: string) => {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists() && userSnap.data().displayName) {
        displayName.value = userSnap.data().displayName.slice(0, 12);
    } else {
        displayName.value = 'User';
    }
}

const fetchPlayerStats = async (userId: string) => {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
        const userData = userSnap.data();
        playerStats.value = {
            wins: userData.games.tictactoe.wins || 0,
            losses: userData.games.tictactoe.losses || 0,
            draws: userData.games.tictactoe.draws || 0
        };
        // Add total score from userData
        totalScore.value = userData.score || 0;
    }
};

const allAchievements = ref<Array<{
    name: string;
    description: string;
    achieved: boolean;
    dateAchieved?: Date;
    icon?: string;
}>>([]);

const getAchievementIcon = (iconName: string) => {
    // Use a base path for your images
    const basePath = '/assets/images/';
    return `${basePath}${iconName}`;
};

const fetchAllAchievements = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const userRef = doc(db, "users", user.uid);
    const achievementsRef = collection(userRef, "achievements");
    const achievementsSnap = await getDocs(achievementsRef);

    const userAchievements = achievementsSnap.docs.map(doc => ({
        name: doc.id,
        description: doc.data().description,
        achieved: true,
        dateAchieved: doc.data().dateAchieved.toDate(),
        icon: doc.data().icon
    }));

    // Define all possible achievements
    const allPossibleAchievements = [
        { name: "First Win", description: "Win your first game", icon: "trophy.webp" },
        { name: "3 Wins in a Row", description: "Win 3 games consecutively", icon: "trophy.webp" },
        { name: "Score of 100", description: "Achieve a score of 100 points", icon: "trophy.webp" }
    ];

    // Merge user achievements with all possible achievements
    return allPossibleAchievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.name === achievement.name);
        return userAchievement
            ? { ...achievement, ...userAchievement, icon: userAchievement.icon || achievement.icon }
            : { ...achievement, achieved: false };
    });
};

// Add new refs for edit name functionality
const showEditNamePopup = ref(false);
const newDisplayName = ref('');

// Add updateDisplayName function
const updateDisplayName = async () => {
    if (!user.value) return;
    
    // Trim and limit the name to 10 characters
    const trimmedName = newDisplayName.value.trim().slice(0, 12);
    
    if (!trimmedName) return;

    try {
        const userDoc = doc(db, 'users', user.value.uid);
        await updateDoc(userDoc, {
            displayName: trimmedName
        });

        displayName.value = trimmedName;
        showEditNamePopup.value = false;
        newDisplayName.value = '';

        // Reload the page after successful update
        window.location.reload();
    } catch (error) {
        console.error('Error updating display name:', error);
    }
};

// Add totalScore ref with the other refs
const totalScore = ref(0);

onMounted(async () => {
    onAuthStateChanged(auth, async (currentUser) => {
        user.value = currentUser;
        if (currentUser) {
            fetchDisplayName(currentUser.uid);
            fetchPlayerStats(currentUser.uid);
            fetchUserPhoto(); // Add this line to fetch the user's photo
            try {
                await checkAchievements();
                allAchievements.value = await fetchAllAchievements();
            } catch (error) {
                console.error('Error fetching achievements:', error);
                allAchievements.value = [];
            }
        } else {
            displayName.value = 'Guest';
            playerStats.value = { wins: 0, losses: 0, draws: 0 };
            allAchievements.value = [];
            userPhotoURL.value = defaultAvatar;
        }
    });
});
</script>

<style lang="scss" scoped>
</style>
