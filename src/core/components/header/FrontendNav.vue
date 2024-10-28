<template>
  <header class="text-white">
    <nav class="container mx-auto px-4 mb-4 ms:py-2 flex justify-between items-center">
      <a href="/" class="text-2xl font-bold text-glow">Tic Tac Toe</a>
      <div class="flex space-x-4 items-center">
        <div class="relative hover:bg-blue-800 rounded-full transition-all duration-300 hover:scale-105 p-2"
          v-if="user">
          <a href="/profile" class="flex items-center space-x-2">
            <span class="mr-2 text-ellipsis hidden ml:block">{{ displayName.length > 3 ? displayName.slice(0,3) + '...' : displayName }}</span>
            <div v-if="user.photoURL" class="w-8 h-8">
              <img :src="userPhotoURL" alt="User profile" class="w-full h-full object-cover rounded-full">
            </div>
          </a>
        </div>
        <button v-else class="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105">
          <span class="icon-user w-6 h-6"></span>
        </button>
        <a href="/rank"
          class="p-2 ms:p-2 md:p-2 rounded-full hover:bg-purple-800 transition-all duration-300 hover:scale-105">
          <img src="/assets/icons/cup.svg" alt="Logout" loading="lazy" class="w-6 h-6">
        </a>
        <button class="p-2 ms:p-2 md:p-2 rounded-full hover:bg-red-500" @click="logout">
          <img src="/assets/icons/logout.svg" alt="Logout" loading="lazy" class="w-6 h-6">
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { auth, onAuthStateChanged, User, signOut, db, doc, getDoc } from '@/core/plugins/firebase';
import { useRouter } from 'vue-router';

const user = ref<User | null>(null);
const displayName = ref('');
const router = useRouter();
const defaultAvatar = '/assets/images/cat.webp';
const userPhotoURL = ref(defaultAvatar);

const logout = async () => {
  try {
    await signOut(auth);
    router.push('/');
    window.location.reload();
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

const fetchDisplayName = async (userId: string) => {
    const userDoc = doc(db, 'users', userId);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists() && userSnap.data().displayName) {
        displayName.value = userSnap.data().displayName.slice(0, 10);
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
    }
  });
})
</script>

<style scoped lang="scss">
header {
  transition: 0.5s all ease-out;
}
</style>
