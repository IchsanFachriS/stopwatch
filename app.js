// Improved timer variables with better initialization
let ss = 0, mm = 0, hh = 0, dd = 0;
let timerInterval = null;
let isTimeRunning = false;
let isPaused = false;
let isReset = true;

// DOM element selections - using more specific selectors for better performance
const startButton = document.querySelector(".start");
const pauseButton = document.querySelector(".pause");
const resetButton = document.querySelector(".reset");
const lapButton = document.querySelector(".lap");
const roundsContainer = document.querySelector(".container");

// Timer display elements
const secDisplay = document.querySelector(".ss");
const minDisplay = document.querySelector(".mm");
const hrDisplay = document.querySelector(".hh");
const dayDisplay = document.querySelector(".dd");

// Round tracking variables
let roundNumber = 1;
let lapNumber = 1;
let currentRoundElement = null;
let lapStartTime = { dd: 0, hh: 0, mm: 0, ss: 0 };
let previousLapTime = { dd: 0, hh: 0, mm: 0, ss: 0 };

/**
 * Format a number to always have 2 digits
 * @param {number} num - Number to format
 * @return {string} Formatted number with leading zero if needed
 */
function formatNumber(num) {
    return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Update the timer display with current values
 */
function updateTimerDisplay() {
    secDisplay.textContent = formatNumber(ss);
    minDisplay.textContent = formatNumber(mm);
    hrDisplay.textContent = formatNumber(hh);
    dayDisplay.textContent = formatNumber(dd);
}

/**
 * Main timer function - increments the timer values
 */
function count() {
    ss++;
    if (ss >= 60) {
        ss = 0;
        mm++;
        if (mm >= 60) {
            mm = 0;
            hh++;
            if (hh >= 24) {
                hh = 0;
                dd++;
            }
        }
    }
    updateTimerDisplay();
}

/**
 * Start the timer
 */
function startCount() {
    if (!isTimeRunning) {
        if (isReset) {
            // Create a new round when starting from reset
            createNewRound();
            // Store the starting time for the first lap
            lapStartTime = { dd: 0, hh: 0, mm: 0, ss: 0 };
            previousLapTime = { dd: 0, hh: 0, mm: 0, ss: 0 };
        }
        timerInterval = setInterval(count, 1000);
        isTimeRunning = true;
        isPaused = false;
        isReset = false;
    }
}

/**
 * Pause the timer
 */
function pauseCount() {
    if (isTimeRunning && !isPaused) {
        clearInterval(timerInterval);
        isTimeRunning = false;
        isPaused = true;
    }
}

/**
 * Reset the timer and add final time to current round
 */
function resetCount() {
    if (!isReset) {
        pauseCount();
        
        // Add final time to the current round if there is an active round
        if (currentRoundElement && !isReset) {
            addFinalTime();
        }
        
        // Reset all timer values
        ss = mm = hh = dd = 0;
        updateTimerDisplay();
        
        // Reset lap counter
        lapNumber = 1;
        isReset = true;
    }
}

/**
 * Create a new round element in the UI
 */
function createNewRound() {
    // Create the round container
    currentRoundElement = document.createElement("div");
    currentRoundElement.classList.add("rounds");
    
    // Create and add the round number header
    const roundHeaderElement = document.createElement("div");
    roundHeaderElement.classList.add("rnd_no");
    roundHeaderElement.textContent = `Round ${roundNumber}`;
    currentRoundElement.appendChild(roundHeaderElement);
    
    // Add the round element to the container
    roundsContainer.appendChild(currentRoundElement);
    roundNumber++;
}

/**
 * Add final time to the current round
 */
function addFinalTime() {
    if (!currentRoundElement) return;
    
    const finalTimeElement = document.createElement("div");
    finalTimeElement.classList.add("totaltime");
    finalTimeElement.textContent = `Total Time - ${formatNumber(dd)}:${formatNumber(hh)}:${formatNumber(mm)}:${formatNumber(ss)}`;
    currentRoundElement.appendChild(finalTimeElement);
}

/**
 * Calculate and format the lap time delta from previous lap
 * @return {string} Formatted lap time
 */
function getLapTimeDelta() {
    let deltaDD = dd - previousLapTime.dd;
    let deltaHH = hh - previousLapTime.hh;
    let deltaMM = mm - previousLapTime.mm;
    let deltaSS = ss - previousLapTime.ss;
    
    // Handle negative seconds
    if (deltaSS < 0) {
        deltaSS += 60;
        deltaMM--;
    }
    
    // Handle negative minutes
    if (deltaMM < 0) {
        deltaMM += 60;
        deltaHH--;
    }
    
    // Handle negative hours
    if (deltaHH < 0) {
        deltaHH += 24;
        deltaDD--;
    }
    
    return `${formatNumber(deltaDD)}:${formatNumber(deltaHH)}:${formatNumber(deltaMM)}:${formatNumber(deltaSS)}`;
}

/**
 * Add a lap to the current round
 */
function addLap() {
    // Don't add laps if timer is not running or no round exists
    if (!isTimeRunning) return;
    
    // Create a new round if needed
    if (!currentRoundElement) {
        createNewRound();
    }
    
    // Create the lap container
    const lapElement = document.createElement("div");
    lapElement.classList.add("laps");
    
    // Create the lap number element
    const lapNumberElement = document.createElement("div");
    lapNumberElement.classList.add("lapno");
    lapNumberElement.textContent = lapNumber;
    lapElement.appendChild(lapNumberElement);
    
    // Create the lap time element
    const lapTimeElement = document.createElement("div");
    lapTimeElement.classList.add("laptime");
    
    // Get the current time for this lap
    const currentTime = `${formatNumber(dd)}:${formatNumber(hh)}:${formatNumber(mm)}:${formatNumber(ss)}`;
    
    // For lap 1, show the full time
    if (lapNumber === 1) {
        lapTimeElement.textContent = currentTime;
    } else {
        // For subsequent laps, show the delta time
        const deltaTime = getLapTimeDelta();
        lapTimeElement.textContent = `${deltaTime} (${currentTime})`;
    }
    
    lapElement.appendChild(lapTimeElement);
    currentRoundElement.appendChild(lapElement);
    
    // Update the lap counter and store the current time for the next lap
    lapNumber++;
    previousLapTime = { dd, hh, mm, ss };
}

/**
 * Clear all rounds from the UI
 */
function clearAllRounds() {
    // Remove all rounds except the header
    const header = roundsContainer.querySelector(".rnds");
    roundsContainer.innerHTML = '';
    if (header) {
        roundsContainer.appendChild(header);
    }
    
    // Reset round and lap counters
    roundNumber = 1;
    lapNumber = 1;
    currentRoundElement = null;
}

// Set up event listeners with improved event handling
startButton.addEventListener("click", startCount);
pauseButton.addEventListener("click", pauseCount);
resetButton.addEventListener("click", resetCount);
lapButton.addEventListener("click", addLap);

// Add a new keyboard shortcut feature
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        if (isTimeRunning) {
            pauseCount();
        } else {
            startCount();
        }
    } else if (event.code === "KeyL") {
        if (isTimeRunning) {
            addLap();
        }
    } else if (event.code === "KeyR") {
        resetCount();
    }
});

// Function to keep UI updated every 100ms for smoother animations
function updateUI() {
    updateTimerDisplay();
    requestAnimationFrame(updateUI);
}

// Initialize the UI
updateTimerDisplay();
requestAnimationFrame(updateUI);