<template>

    <div class="relative">
        <StartBackground />
        <div class="flex flex-col lg:flex-row items-center justify-center h-[90vh] p-0 xl:pr-32 xl:pl-32">
            <!-- Player Card -->
            <div class="w-full lg:w-1/4 p-4 mb-4 lg:mb-0 hidden lg:block"
                v-if="popupMessage !== 'loss' && popupMessage !== 'win' && popupMessage !== 'draw'">
                <div class="bg-primary border-4 border-secondary rounded-2xl shadow-lg p-6 text-center text-white"
                    :class="{ 'active-player': currentPlayer === 'X' }">
                    <div class="flex items-center justify-center mb-4">
                        <CardProfile />
                    </div>
                    <span class="text-red-500 text-2xl font-bold">X</span>
                    <p class="text-lg mt-2">
                        <p>Score: {{ playerScore }}</p>
                        <p v-if="consecutiveWins > 0" class="text-sm text-green-400">
                            Win Streak: {{ consecutiveWins }}/3
                        </p>
                    </p>
                </div>
            </div>

            <!-- Game Board -->
            <div class="view w-full lg:w-1/2 h-[60vh] lg:h-[50vh] flex items-center justify-center">
                <div class="card w-full sm:w-[80%] md:w-[70%] lg:w-[90%] mx-auto">
                    <div class="front rounded-2xl" :style="{ transform: isView ? 'rotateY(180deg)' : 'rotateY(0deg)' }">
                        <div class="w-full h-full flex flex-col items-center justify-center">
                            <div class="board ms:h-[50vh] ms:w-[90vw] grid grid-cols-3 gap-2 p-4 rounded-xl w-full max-w-[400px]">
                                <div v-for="(cell, index) in board" :key="index" @click="makeMove(index)"
                                    class="aspect-square flex items-center justify-center text-4xl font-bold cursor-pointer rounded-2xl"
                                    :class="getCellClass(cell)">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="back rounded-xl" :style="{ transform: isView ? 'rotateY(0deg)' : 'rotateY(-180deg)' }">
                        <div class="text-center">
                            <h2 class="text-2xl sm:text-3xl font-bold mb-2 text-white">{{ popupMessageTitle }}</h2>
                            <p class="text-lg text-gray-200 mb-6">{{ popupMessageSubtitle }}</p>
                        </div>
                        <ProfileImage v-if="popupMessage === 'win'"
                            class="w-28 h-28 items-center justify-center border-4 border-secondary rounded-full" />
                        <ProfileDisplayName v-if="popupMessage === 'win'"
                            class="text-white text-xl font-bold mt-4" />
                        <div v-if="popupMessage === 'loss'">
                            <img src="@/assets/images/bot.png" alt="Player Avatar" class="w-16 h-16 rounded-full mb-2">
                            <h2 class="text-2xl font-bold mb-4">Bot </h2>
                        </div>
                        <br>
                        <button type="button" @click="resetGame"
                            class="button-reload shadow-xl rounded-full p-2 border-none outline-none">
                            <img src="@/assets/icons/reload.svg"
                                class="w-12 p-2 hover:rotate-180 transition-all duration-300" alt=""></button>
                    </div>
                </div>
            </div>

            <!-- Bot Card -->
            <div class=" w-full lg:w-1/4 p-4 mb-4 lg:mb-0 hidden lg:block"
                v-if="popupMessage !== 'loss' && popupMessage !== 'win' && popupMessage !== 'draw'">
                <div class="bg-primary flex flex-col items-center border-4 border-secondary rounded-2xl shadow-lg p-6 text-center text-white"
                    :class="{ 'active-player': currentPlayer === 'O' }">
                    <img src="@/assets/images/bot.png" alt="Player Avatar" class="w-16 h-16 rounded-full mb-2">
                    <h2 class="text-2xl font-bold mb-4">Bot </h2>
                    <span class="text-yellow-500 text-2xl font-bold">O</span>
                    <p class="text-lg mt-2">Score: {{ botScore }}</p>
                </div>
            </div>

            <div class="flex flex-row lg:hidden"
                v-if="popupMessage !== 'loss' && popupMessage !== 'win' && popupMessage !== 'draw'">
                <div class="w-1/2 p-2 mb-4 lg:mb-0">
                    <div class="bg-primary border-4 border-secondary rounded-2xl shadow-lg p-6 text-center text-white"
                        :class="{ 'active-player': currentPlayer === 'X' }">
                        <div class="flex items-center justify-center mb-4">
                            <CardProfile />
                        </div>
                        <span class="text-red-500 text-2xl font-bold">X</span>
                        <p class="text-lg mt-2">Score: {{ playerScore }}</p>
                    </div>
                </div>

                <!-- Bot Card -->
                <div class="w-1/2 p-2 mb-4 lg:mb-0">
                    <div class="bg-primary flex flex-col items-center border-4 border-secondary rounded-2xl shadow-lg p-6 text-center text-white"
                        :class="{ 'active-player': currentPlayer === 'O' }">
                        <img src="@/assets/images/bot.png" alt="Player Avatar" class="w-16 h-16 rounded-full mb-2">
                        <h2 class="text-2xl font-bold mb-4">Bot </h2>
                        <span class="text-yellow-500 text-2xl font-bold">O</span>
                        <p class="text-lg mt-2">Score: {{ botScore }}</p>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { auth, db, doc, updateDoc, getDoc } from '../../plugins/firebase';
import { updateScoreAndConsecutiveWins } from '@/core/services/achievements';
import CardProfile from '../profile/CardProfile.vue';
import confetti from 'canvas-confetti';
import ProfileImage from '../profile/ProfileImage.vue';
import ProfileDisplayName from '../profile/ProfileDisplayName.vue';
import StartBackground from '../bg/StarBackground.vue';


type Cell = 'X' | 'O' | ''
type Board = Record<number, Cell>

const board = ref<Board>({
    0: '', 1: '', 2: '',
    3: '', 4: '', 5: '',
    6: '', 7: '', 8: ''
});

const currentPlayer = ref<'X' | 'O'>('X')
const winner = ref<string | null>(null)
const showPopup = ref(false)
const popupMessage = ref('')
const winningCells = ref<number[]>([])
const playerScore = ref(0)
const botScore = ref(0)
const isView = ref(false)

const playerName = ref('Player')
const playerAvatar = ref('/path/to/default/avatar.png') // Set a default avatar path

// Add these new refs after the existing refs
const consecutiveWins = ref(0)
const statusMessage = ref('')
const popupMessageTitle = ref('')
const popupMessageSubtitle = ref('')

onMounted(async () => {
    const user = auth.currentUser;
    if (user) {
        // const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            playerName.value = userData.displayName || 'Player';
            playerAvatar.value = userData.photoURL || '/path/to/default/avatar.png';
        }
    }
})

const updateGameResult = async (result: 'win' | 'loss' | 'draw') => {
    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const games = userData.games || {};
            games.tictactoe = games.tictactoe || { wins: 0, losses: 0, draws: 0 };

            if (result === 'win') games.tictactoe.wins++;
            else if (result === 'loss') games.tictactoe.losses++;
            else if (result === 'draw') games.tictactoe.draws++;

            await updateDoc(userRef, { games });
        }
    }
}

const makeMove = (index: number) => {
    if (winner.value === null && board.value[index] === '' && currentPlayer.value === 'X') {
        board.value[index] = currentPlayer.value
        checkWinner()
        if (!winner.value) {
            // Check for draw after the move
            if (Object.values(board.value).every(cell => cell !== '')) {
                setTimeout(() => {
                    popupMessageTitle.value = "It's a Draw!"
                    popupMessageSubtitle.value = 'Nobody wins this time'
                    popupMessage.value = 'draw'
                    isView.value = true
                    updateGameResult('draw');
                    consecutiveWins.value = 0
                }, 1000);
                return;
            }
            currentPlayer.value = 'O'
            statusMessage.value = "Bot's turn..."
            setTimeout(botMove, 500)
        } else if (winner.value === 'X') {
            const user = auth.currentUser;
            if (user) {
                consecutiveWins.value++
                if (consecutiveWins.value === 3) {
                    playerScore.value++
                    popupMessageTitle.value = 'Victory!'
                    popupMessageSubtitle.value = '3 Win Streak Bonus Point! 🏆'
                    consecutiveWins.value = 0
                } else {
                    popupMessageTitle.value = 'You Win!'
                    popupMessageSubtitle.value = `Win Streak: ${consecutiveWins.value}/3`
                }
                playerScore.value++
                updateScoreAndConsecutiveWins(true);
                updateGameResult('win');
            }
            setTimeout(() => {
                popupMessage.value = 'win'
                isView.value = true
                triggerConfetti()
            }, 1000);
        }
    }
}

const botMove = () => {
    const availableCells = Object.keys(board.value)
        .filter(i => board.value[parseInt(i)] === '')
        .map(i => parseInt(i))

    if (availableCells.length > 0 && winner.value === null) {
        statusMessage.value = "Your turn..."
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)]
        board.value[randomIndex] = 'O'
        checkWinner()
        currentPlayer.value = 'X'
        
        if (winner.value === 'O') {
            updateScoreAndConsecutiveWins(false);
            updateGameResult('loss');
            botScore.value++
            playerScore.value = Math.max(0, playerScore.value - 1)
            consecutiveWins.value = 0
            setTimeout(() => {
                popupMessageTitle.value = 'You Lost!'
                popupMessageSubtitle.value = '-1 point'
                popupMessage.value = 'loss'
                isView.value = true
            }, 1000);
        } else if (Object.values(board.value).every(cell => cell !== '') && !winner.value) {
            // Updated draw condition check
            popupMessageTitle.value = "It's a Draw!"
            popupMessageSubtitle.value = 'Nobody wins this time'
            popupMessage.value = 'draw'
            isView.value = true
            updateGameResult('draw');
            consecutiveWins.value = 0
        }
    }
}

const checkWinner = () => {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    for (const combination of winningCombinations) {
        if (board.value[combination[0]] === board.value[combination[1]] &&
            board.value[combination[1]] === board.value[combination[2]] &&
            board.value[combination[0]] !== '') {
            winner.value = board.value[combination[0]]
            winningCells.value = combination
            highlightWinningCells()
            return
        }
    }

    // Check for a draw - moved from here to makeMove and botMove functions
}

const highlightWinningCells = () => {
    winningCells.value.forEach(index => {
        const cellElement = document.querySelector(`.board div:nth-child(${index + 1})`)
        if (cellElement) {
            cellElement.classList.add('winning-cell')
        }
    })
}

const resetGame = () => {
    board.value = {
        0: '', 1: '', 2: '',
        3: '', 4: '', 5: '',
        6: '', 7: '', 8: ''
    }
    currentPlayer.value = 'X'
    winner.value = null
    winningCells.value = []
    showPopup.value = false
    isView.value = false
    popupMessage.value = ''
    const cellElements = document.querySelectorAll('.board div')
    cellElements.forEach(cell => cell.classList.remove('winning-cell'))
    statusMessage.value = "Your turn..."
    popupMessageTitle.value = ''
    popupMessageSubtitle.value = ''
}

const getCellClass = computed(() => (cell: Cell) => {
    if (cell === 'X') return 'x-cell'
    if (cell === 'O') return 'o-cell'
    return ''
})

// Add this new function to trigger the confetti effect
const triggerConfetti = () => {

    var duration = 15 * 100;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}
</script>

<style lang="scss" scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

$x-icon: "\f00d";
$o-icon: "\f10c";

.board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    background-color: #6648c4;
    max-width: 400px;
    aspect-ratio: 1 / 1;
}

.board div {
    background-color: #1d1135;
    font-size: clamp(1.5rem, 5vw, 3rem);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.5s;
    color: white;

    &::before {
        font-family: "FontAwesome";
        font-weight: 900;
    }
}

.x-cell {
    background-color: #eb1750 !important;

    &::before {
        content: $x-icon;
    }

    &.winning-cell {
        animation: x-glow 1.5s infinite alternate;
    }
}

.o-cell {
    background-color: #ecaf4f !important;

    &::before {
        content: $o-icon;
    }

    &.winning-cell {
        animation: o-glow 1.5s infinite alternate;
    }
}

@keyframes x-glow {
    from {
        box-shadow: 0 0 10px #eb1750;
    }

    to {
        box-shadow: 0 0 20px #eb1750, 0 0 30px #eb1750;
    }
}

@keyframes o-glow {
    from {
        box-shadow: 0 0 10px #ecaf4f;
    }

    to {
        box-shadow: 0 0 20px #ecaf4f, 0 0 30px #ecaf4f;
    }
}

.winning-cell {
    &.x-cell {
        animation: x-glow 1.5s infinite alternate;
    }

    &.o-cell {
        animation: o-glow 1.5s infinite alternate;
    }
}

.active-player {
    box-shadow: 0 0 15px 5px rgba(212, 62, 62, 0.5);
    transition: box-shadow 0.3s ease-in-out;
    background-image: linear-gradient(to right, #da2985, #a632f2);
    color: #ffffff;
}

.button-reload {
    background: linear-gradient(to top, #f5548b, #fc796d, #f9a02d)
}

.view {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    padding: 1rem;
    flex-wrap: wrap;
    gap: 2rem;
    box-sizing: border-box;
}

.card {
    --card-width: min(400px, 90vw);
    --card-perspective-factor: 3;
    --card-perspective: calc(var(--card-width) * var(--card-perspective-factor));
    --delta: var(--card-width) / (30 * var(--card-perspective-factor));

    aspect-ratio: 1 / 1;
    position: relative;
    display: flex;
    max-width: calc(var(--card-width) - var(--delta));

    perspective: var(--card-perspective);
}

.front,
.back {
    display: flex;
    position: absolute;
    padding: 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    text-align: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    transition: transform 0.6s;
    backface-visibility: hidden;
}

.front {
    color: #fff;
    background-image: linear-gradient(45deg, #b721ff 15%, #21d4fd 100%);
    box-shadow: 0px 0px 25px 0px rgba(63, 94, 251, 1);

    transform: rotateY(0deg);
}

.back {
    color: #fff;
    background-image: linear-gradient(45deg, #ff00cc, #3333ff, #00ffff);
    background-size: 400% 400%;
    box-shadow: 0px 0px 25px 0px rgba(63, 94, 251, 0.5);

    animation: gradientSpin 5s ease infinite;

    transform: rotateY(-180deg);
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
</style>





