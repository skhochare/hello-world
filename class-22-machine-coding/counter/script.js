const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const pauseBtn = document.getElementById("pause");
const continueBtn = document.getElementById("continue");
const minInput = document.getElementById("min");
const hrsInput = document.getElementById("hr");
const secInput = document.getElementById("sec");

let prevTimer = 0;
let timeInSeconds;
let prevInSecs;
let timerId;

function updateUI() {
    // Update the UI from timeInSeconds
}

startBtn.addEventListener("click", function() {
    // Get the values
    let hrs = hrsInput.value || 0;
    let mins = minInput.value || 0;
    let sec = secInput.value || 0;

    // Find out the timer in seconds
    timeInSeconds = Number(hrs) * 3600 + Number(mins) * 60 + Number(sec);
    timer(timeInSeconds);
});

function timer(timeRemaining) {
    if (timeRemaining === 0) return;

    timerId = setTimeout(() => {
        console.log("Timer clocked", timeRemaining);
        timeInSeconds = --timeRemaining;
        timer(timeRemaining);
    }, 1000);
}

resetBtn.addEventListener("click", function() {
    prevInSecs = 0;

    hrsInput.value = "";
    minInput.value = "";
    secInput.value = "";

    clearTimeout(timerId);
});

pauseBtn.addEventListener("click", function() {
    prevInSecs = timeInSeconds;
    clearTimeout(timerId);
});

continueBtn.addEventListener("click", function() {
    timer(prevInSecs);
});