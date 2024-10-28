<template>
    <div class="flex flex-col items-center">
        <h2>{{ displayName }}</h2>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { auth, onAuthStateChanged, User, db, doc, getDoc } from '@/core/plugins/firebase';

const user = ref<User | null>(null);
const displayName = ref('');

const fetchDisplayName = async (userId: string) => {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists() && userSnap.data().displayName) {
        displayName.value = userSnap.data().displayName;
    } else {
        displayName.value = 'User';
    }
}

onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
        if (currentUser) {
            fetchDisplayName(currentUser.uid);
        } else {
            displayName.value = 'Guest';
        }
    });
})
</script>

<style scoped></style>
