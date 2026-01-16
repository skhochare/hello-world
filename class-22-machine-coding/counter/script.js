const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const pauseBtn = document.getElementById("pause");
const continueBtn = document.getElementById("continue");

const hrsInput = document.getElementById("hr");
const minInput = document.getElementById("min");
const secInput = document.getElementById("sec");

let timeInSeconds = 0;
let timerId = null;

function updateUI() {
    // Calculate units from total seconds
    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = timeInSeconds % 60;

    // Pad with leading zeros for a cleaner look
    hrsInput.value = h.toString().padStart(2, '0');
    minInput.value = m.toString().padStart(2, '0');
    secInput.value = s.toString().padStart(2, '0');
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
}

function startCountdown() {
    if (timerId) return; // Prevent multiple intervals

    timerId = setInterval(() => {
        if (timeInSeconds <= 0) {
            stopTimer();
            alert("Time's up!");
            return;
        }
        timeInSeconds--;
        updateUI();
    }, 1000);
}

startBtn.addEventListener("click", function() {
    const h = parseInt(hrsInput.value) || 0;
    const m = parseInt(minInput.value) || 0;
    const s = parseInt(secInput.value) || 0;

    timeInSeconds = h * 3600 + m * 60 + s;

    if (timeInSeconds > 0) {
        startCountdown();
    }
});

pauseBtn.addEventListener("click", stopTimer);

continueBtn.addEventListener("click", startCountdown);

resetBtn.addEventListener("click", function() {
    stopTimer();
    timeInSeconds = 0;
    hrsInput.value = "";
    minInput.value = "";
    secInput.value = "";
});