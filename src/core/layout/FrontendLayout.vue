<template>
    <main>
        <FrontendNav />
        <ScrollToTopButton />

        <div>
            <router-view />
        </div>

        <FrontendFoot />
    </main>
</template>

<script setup lang="ts">
    // import FrontendFoot from '@/core/components/frontend/footer/FrontendFoot.vue';
    import FrontendNav from '@/core/components/header/FrontendNav.vue';
    // import ScrollToTopButton from '@/core/components/frontend/header/ScrollToTop.vue';

</script>

<style scoped>

</style>