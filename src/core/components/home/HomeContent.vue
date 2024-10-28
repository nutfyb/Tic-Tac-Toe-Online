<template>
    <div class="relative">
        <ParallaxStarBackground />
        <div class="flex flex-col justify-center items-center h-[90vh] relative z-10 overflow-hidden">
            <div class="text-center space-y-8 p-8">
                <h1 class="text-6xl font-bold mb-4 text-glow">Tic Tac Toe</h1>
                <p class="text-xl mb-6 text-blue-200">
                    Challenge the universe in this classic game of strategy.
                </p>
                <div class="space-y-6">
                    <button @click="handleGameStart"
                        class="btn-game-start text-white px-8 py-3 rounded-full w-full text-xl transition-all duration-300 transform hover:scale-105 shadow-neon">
                        Launch Game
                    </button>
                    <p v-if="errorMessage" class="error-message text-red-500">{{ errorMessage }}</p>

                    <!-- Display Name Modal -->
                    <div v-if="showDisplayNameModal"
                        class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div class="modal-content bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 class="text-xl mb-4 text-white">Welcome! Please set your display name</h2>
                            <input v-model="displayName" placeholder="Enter your display name"
                                class="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
                            <button @click="setDisplayName"
                                class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full transition-all duration-300">
                                Set Display Name
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ParallaxStarBackground from '../bg/ParallaxStarBackground.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, provider, signInWithPopup, db, doc, setDoc, getDoc, updateDoc, onAuthStateChanged } from "@/core/plugins/firebase";

const router = useRouter();
const errorMessage = ref('');
const showDisplayNameModal = ref(false);
const displayName = ref('');
const isLoggedIn = ref(false);

onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        isLoggedIn.value = !!user;
    });
});

const handleGameStart = async () => {
    if (isLoggedIn.value) {
        router.push('/game');
    } else {
        await login();
    }
};

const generateDefaultPlayerID = (uid: string) => {
    return `Player${uid.substring(0, 6)}`;
};

const login = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        if (user) {
            const userDoc = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDoc);

            if (!userSnap.exists()) {
                try {
                    const defaultDisplayName = generateDefaultPlayerID(user.uid);
                    await setDoc(userDoc, {
                        email: user.email,
                        score: 0,
                        winStreak: 0,
                        displayName: defaultDisplayName
                    });
                    router.push('/game');
                } catch (setDocError) {
                    console.error('Error setting user document:', setDocError);
                    errorMessage.value = 'Login successful, but failed to create user profile. Please contact support.';
                    return;
                }
            } else if (!userSnap.data().displayName) {
                try {
                    const defaultDisplayName = generateDefaultPlayerID(user.uid);
                    await updateDoc(userDoc, { displayName: defaultDisplayName });
                    router.push('/game');
                } catch (updateError) {
                    console.error('Error updating display name:', updateError);
                    errorMessage.value = 'Failed to set default display name. Please try again.';
                }
            } else {
                router.push('/game');
            }
        }
        errorMessage.value = '';
    } catch (error) {
        console.error('Error during login:', error);
        if (error instanceof Error) {
            errorMessage.value = `Login failed: ${error.message}`;
        } else {
            errorMessage.value = 'Login failed. Please try again later.';
        }
    }
}

const setDisplayName = async () => {
    if (displayName.value.trim() === '') {
        const user = auth.currentUser;
        if (user) {
            const defaultDisplayName = generateDefaultPlayerID(user.uid);
            displayName.value = defaultDisplayName;
        } else {
            errorMessage.value = 'User not found';
            return;
        }
    }

    try {
        const user = auth.currentUser;
        if (user) {
            const userDoc = doc(db, 'users', user.uid);
            await updateDoc(userDoc, { displayName: displayName.value });
            showDisplayNameModal.value = false;
            errorMessage.value = '';
            router.push('/game');
        }
    } catch (error) {
        console.error('Error setting display name:', error);
        errorMessage.value = 'Failed to set display name. Please try again.';
    }
}
</script>

<style lang="scss" scoped>
.btn-game-start {
    background-image: linear-gradient(45deg, #ff00cc, #3333ff, #00ffff);
    background-size: 400% 400%;
    box-shadow: 0px 0px 25px 0px rgba(63, 94, 251, 0.5);
    animation: gradientSpin 5s ease infinite;
}

@keyframes gradientSpin {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

// Add text glow effect
.text-glow {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.7),
        0 0 20px rgba(255, 255, 255, 0.5),
        0 0 30px rgba(255, 255, 255, 0.3);
}

// Add this to prevent any potential scrolling
:deep(body) {
    overflow: hidden;
}
</style>
