<template>
    <div class="flex flex-col items-center">
        <img :src="userPhotoURL || '/default-avatar.png'" alt="Player Avatar" class="w-16 h-16 rounded-full mb-2">
        <h2 class="text-2xl font-bold text-center">{{ displayName }}</h2>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { auth, onAuthStateChanged, User, db, doc, getDoc } from '@/core/plugins/firebase';

const user = ref<User | null>(null);
const displayName = ref('');
const defaultAvatar = '/assets/images/cat.webp';

const userPhotoURL = ref(defaultAvatar);

const fetchDisplayName = async (userId: string) => {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists() && userSnap.data().displayName) {
        displayName.value = userSnap.data().displayName;
    } else {
        displayName.value = 'User';
    }
}

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

onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
        if (currentUser) {
            fetchDisplayName(currentUser.uid);
            fetchUserPhoto();
        } else {
            displayName.value = 'Guest';
        }
    });
})
</script>

<style scoped></style>
