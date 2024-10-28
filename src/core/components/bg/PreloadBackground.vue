<template>
    <div id="frame"
        :class="['transition-all duration-800 ease-in-out', { 'opacity-0': isLoaded, 'opacity-100': !isLoaded }, { 'hidden': loaded }]"
        class="z-50">
        <div id="box">
            <div v-for="i in 8" :key="'dot' + i" :class="['dot', `dot${i}`]"></div>
            <div v-for="i in 4" :key="'bar' + i" :class="['bar', `bar${i}`]"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['loaded']);
const isLoaded = ref(false);
const loaded = ref(false);
document.documentElement.style.overflow = 'hidden';

const completeLoading = () => {
    isLoaded.value = true;
};

onMounted(() => {
    setTimeout(() => {
        completeLoading();
        document.documentElement.style.overflow = 'visible';
    }, 2000);

    setTimeout(() => {
        loaded.value = true;
    }, 2400);
});

document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        isLoaded.value = false;
        setTimeout(() => {
            completeLoading();
        }, 2000);
    }
};
</script>

<style lang="scss" scoped>
@use "sass:color";
@import url("https://fonts.googleapis.com/css?family=Quicksand:300,400,700") all;

// Updated color scheme to match main theme
$clr1: #0a0a12;
$clr2: #1d1135;
$clr3: #6648c4;
$clr4: #eb1750;
$clr5: #ecaf4f;
$clr6: #00ffff;

body {
    background: #121212; // Darker background
}

#frame {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    width: 100%;
    height: 100%;
    background: $clr1;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.25);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

    &.hidden {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1.5);
        pointer-events: none;
    }
}

#box {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -107px;
    margin-left: -107px;
    width: 215px;
    height: 215px;
    animation: spin 16s ease infinite;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center center;

    &.zoom-out {
        transform: scale(0.7);
        opacity: 0;
    }

    .dot {
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: $clr2;
        z-index: 2;
        border: 1px solid #fff;

        &.dot1 {
            top: -1px;
            left: 132px;
            z-index: 4;
            animation: slide1 4s ease infinite;
        }

        &.dot2 {
            left: 88px;
        }

        &.dot3 {
            top: 88px;
            left: 0;
        }

        &.dot4 {
            top: 88px;
            left: 44px;
            animation: slide2 4s ease infinite;
        }

        &.dot5 {
            top: 88px;
            left: 132px;
            animation: slide1 4s ease infinite;
        }

        &.dot6 {
            top: 88px;
            left: 175px;
        }

        &.dot7 {
            top: 175px;
            left: 88px;
        }

        &.dot8 {
            top: 175px;
            left: 44px;
            z-index: 4;
            animation: slide2 4s ease infinite;
        }
    }

    .bar {
        position: absolute;
        width: 140px;
        height: 40px;
        transform: rotate(-26deg);
        border-radius: 20px;

        &.bar1 {
            top: 22px;
            left: 38px;
            background: $clr3;
            z-index: 3;
            animation: slide3 4s 1s ease infinite;
        }

        &.bar2 {
            width: 140px;
            top: 66px;
            left: 38px;
            background: $clr4;
            animation: slide4 4s 1s ease infinite;
        }

        &.bar3 {
            top: 110px;
            left: 38px;
            background: $clr5;
            animation: slide5 4s 1s ease infinite;
        }

        &.bar4 {
            width: 140px;
            top: 154px;
            left: 37px;
            background: $clr6;
            z-index: 3;
            animation: slide6 4s 1s ease infinite;
        }
    }
}

@keyframes slide1 {
    12.5% {
        transform: translate(-92px, 44px);
    }

    25% {
        transform: translate(-92px, 44px);
    }

    37.5% {
        transform: translate(0);
    }

    50% {
        transform: translate(0);
    }

    62.5% {
        transform: translate(-88px, 44px);
    }

    75% {
        transform: translate(-88px, 44px);
    }

    87.5% {
        transform: translate(0);
    }

    100% {
        transform: translate(0);
    }
}

@keyframes slide2 {
    12.5% {
        transform: translate(90px, -44px);
    }

    25% {
        transform: translate(90px, -44px);
    }

    37.5% {
        transform: translate(0);
    }

    50% {
        transform: translate(0);
    }

    62.5% {
        transform: translate(88px, -44px);
    }

    75% {
        transform: translate(88px, -44px);
    }

    87.5% {
        transform: translate(0);
    }

    100% {
        transform: translate(0);
    }
}

@keyframes slide3 {

    12.5%,
    25%,
    37.5%,
    50% {
        width: 40px;
        top: 44px;
        left: 44px;
    }

    62.5%,
    75%,
    87.5%,
    100% {
        width: 140px;
        top: 22px;
        left: 35px;
    }
}

@keyframes slide4 {

    12.5%,
    25%,
    37.5%,
    50% {
        top: 44px;
        width: 40px;
        left: 132px;
    }

    62.5%,
    75%,
    87.5%,
    100% {
        top: 66px;
        width: 140px;
        left: 40px;
    }
}

@keyframes slide5 {

    12.5%,
    25%,
    37.5%,
    50% {
        width: 40px;
        top: 132px;
        left: 44px;
    }

    62.5%,
    75%,
    87.5%,
    100% {
        width: 140px;
        top: 110px;
        left: 37px;
    }
}

@keyframes slide6 {

    12.5%,
    25%,
    37.5%,
    50% {
        top: 132px;
        width: 40px;
        left: 132px;
    }

    62.5%,
    75%,
    87.5%,
    100% {
        top: 154px;
        width: 140px;
        left: 40px;
    }
}

@keyframes spin {
    6.25% {
        transform: rotate(0deg);
    }

    12.5% {
        transform: rotate(45deg);
    }

    18.75% {
        transform: rotate(45deg);
    }

    25% {
        transform: rotate(90deg);
    }

    31.25% {
        transform: rotate(90deg);
    }

    37.5% {
        transform: rotate(135deg);
    }

    43.75% {
        transform: rotate(135deg);
    }

    50% {
        transform: rotate(180deg);
    }

    56.25% {
        transform: rotate(180deg);
    }

    62.5% {
        transform: rotate(225deg);
    }

    68.75% {
        transform: rotate(225deg);
    }

    75% {
        transform: rotate(270deg);
    }

    81.25% {
        transform: rotate(270deg);
    }

    87.5% {
        transform: rotate(315deg);
    }

    93.75% {
        transform: rotate(315deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

#credit {
    position: absolute;
    right: 5px;
    bottom: 5px;
    font: 14px Quicksand;
    z-index: 1;

    a {
        color: color.adjust($clr6, $lightness: -8%);
        text-decoration: none;

        &:hover {
            color: color.adjust($clr6, $lightness: -15%);
        }
    }
}
</style>
