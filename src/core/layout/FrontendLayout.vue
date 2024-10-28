<template>
    <main>
        <FrontendNav />

        <div>
            <router-view />
        </div>
    </main>
</template>

<script setup lang="ts">
    import FrontendNav from '@/core/components/header/FrontendNav.vue';

</script>

<style scoped>

</style>