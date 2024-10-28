<template>
    <div class="relative min-h-screen">
        <StartBackground />
        <div class="max-w-2xl mx-auto p-8">
            <h1 class="flex justify-center items-center gap-4 mb-8 text-2xl font-bold text-white">
                Leaderboard
            </h1>

            <div v-if="loading" class="loading text-blue-500 text-center p-4 bg-white/10 rounded-md backdrop-blur-md">
                Loading rankings...
            </div>

            <div v-else-if="error" class="error text-red-500 text-center p-4 bg-white/10 rounded-md backdrop-blur-md">
                {{ error }}
            </div>

            <div v-else-if="players.length === 0" class="no-data text-gray-500 text-center p-4 bg-white/10 rounded-md backdrop-blur-md">
                No rankings available yet
            </div>
            <div v-else class="flex flex-col gap-4">
                <div v-for="(player, index) in players" 
                     :key="player.uid" 
                     class="flex items-center p-4 bg-white/10 rounded-lg backdrop-blur-md">
                    <div class="w-10 h-10 flex items-center justify-center mr-4">
                        <img v-if="index === 0" src="@/assets/images/no-1.webp" alt="1st place" class="w-full h-full">
                        <img v-else-if="index === 1" src="@/assets/images/no-2.webp" alt="2nd place" class="w-full h-full">
                        <img v-else-if="index === 2" src="@/assets/images/no-3.webp" alt="3rd place" class="w-full h-full">
                        <div v-else class="w-full h-full flex items-center justify-center rounded-full text-white font-bold">
                            {{ index + 1 }}
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="text-lg font-medium text-white">{{ player.displayName }}</div>
                        <div class="text-sm text-white">{{ player.score }} points</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/core/firebase/init'
import StartBackground from '../bg/StarBackground.vue';

interface Player {
    uid: string
    displayName: string
    score: number
}

const players = ref<Player[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchRankings = async () => {
    try {
        loading.value = true
        error.value = null

        const usersRef = collection(db, 'users')
        const q = query(usersRef, orderBy('score', 'desc'))
        const querySnapshot = await getDocs(q)

        players.value = querySnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        } as Player))
    } catch (err) {
        console.error('Error fetching rankings:', err)
        error.value = 'Unable to load rankings. Please try again later.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchRankings()
})
</script>

<style scoped>
</style>
