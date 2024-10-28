<template>
    <div class="starry-background">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use "sass:math";
@use "sass:string";

// n is number of stars required
@function multiple-box-shadow($n) {
    // Increased the random range to handle larger screens
    $value: '#{math.random(4000)}px #{math.random(4000)}px #FFF';
    
    @for $i from 2 through $n {
        $value: '#{$value}, #{math.random(4000)}px #{math.random(4000)}px #FFF';
    }
    
    @return string.unquote($value);
}

$shadows-small: multiple-box-shadow(700);
$shadows-medium: multiple-box-shadow(200);
$shadows-big: multiple-box-shadow(100);

.starry-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    min-width: 100vw;
    min-height: 100vh;
    background: radial-gradient(ellipse at bottom, #1d1135 0%, #090A0F 100%);
    background-size: cover;
    z-index: 0;
}

#stars,
#stars2,
#stars3 {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
}

#stars {
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: $shadows-small;
    animation: animStar 50s linear infinite;

    &:after {
        content: " ";
        position: absolute;
        top: 1000px; // Increased from 2000px
        width: 1px;
        height: 1px;
        background: transparent;
        box-shadow: $shadows-small;
    }
}

#stars2 {
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: $shadows-medium;
    animation: animStar 100s linear infinite;

    &:after {
        content: " ";
        position: absolute;
        top: 4000px; // Increased from 2000px
        width: 2px;
        height: 2px;
        background: transparent;
        box-shadow: $shadows-medium;
    }
}

#stars3 {
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: $shadows-big;
    animation: animStar 150s linear infinite;

    &:after {
        content: " ";
        position: absolute;
        top: 4000px; // Increased from 2000px
        width: 3px;
        height: 3px;
        background: transparent;
        box-shadow: $shadows-big;
    }
}

@keyframes animStar {
    from {
        transform: translateY(0px);
    }

    to {
        transform: translateY(-4000px); // Increased from -2000px
    }
}
</style>
