<template>
  <div id="w" class="fixed inset-0 -z-10">
    <canvas id="space" ref="spaceCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const spaceCanvas = ref<HTMLCanvasElement | null>(null);
let animate = true;

let numStars = 200;
let radius = `0.${Math.floor(Math.random() * 9) + 1}`;
let focalLength = 0;
let warp = 0;
let centerX: number;
let centerY: number;
let stars: { x: number; y: number; z: number; o: string }[] = [];
let c: CanvasRenderingContext2D | null;

function initializeStars() {
  if (!spaceCanvas.value) return;
  const canvas = spaceCanvas.value;

  // Reset dimensions before initializing stars
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width,
      o: `0.${Math.floor(Math.random() * 99) + 1}`,
    });
  }
}

function moveStars() {
  if (!spaceCanvas.value) return;  // Add null check
  
  for (let i = 0; i < numStars; i++) {
    const star = stars[i];
    star.z--;
    if (star.z <= 0) {
      star.z = spaceCanvas.value.width;
    }
  }
}

function drawStars() {
  if (!spaceCanvas.value || !c) return;
  const canvas = spaceCanvas.value;

  // Resize the canvas to the screen
  if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeStars();
  }

  if (warp === 0) {
    const gradient = c.createRadialGradient(centerX, canvas.height, 0, centerX, canvas.height, canvas.height);
    gradient.addColorStop(0, '#1d1135');
    gradient.addColorStop(1, '#090A0F');
    c.fillStyle = gradient;
    c.fillRect(0, 0, canvas.width, canvas.height);
  }

  c.fillStyle = `rgba(209, 255, 255, ${radius})`;
  for (let i = 0; i < numStars; i++) {
    const star = stars[i];

    const pixelX = (star.x - centerX) * (focalLength / star.z) + centerX;
    const pixelY = (star.y - centerY) * (focalLength / star.z) + centerY;
    const pixelRadius = 1 * (focalLength / star.z);

    c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
    c.fillStyle = `rgba(209, 255, 255, ${star.o})`;
  }
}

function executeFrame() {
  if (!animate || !spaceCanvas.value) return;  // Add safety check
  
  moveStars();
  drawStars();
  window.requestAnimationFrame(executeFrame);
}

onMounted(() => {
  if (spaceCanvas.value) {
    const canvas = spaceCanvas.value;
    c = canvas.getContext("2d");
    if (!c) return;

    // Set initial canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    focalLength = canvas.width * 2;
    initializeStars();

    // Start animation after everything is initialized
    animate = true;
    window.addEventListener("resize", () => initializeStars());
    requestAnimationFrame(executeFrame);
  }
});

onUnmounted(() => {
  animate = false;
  window.removeEventListener("resize", initializeStars);
});
</script>

<style scoped>
#space {
  width: 100%;
  height: 100%;
}
</style>
