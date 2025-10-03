/*
  Stopwatch App
  - Start, Stop, Reset, Lap functionality
  - Milliseconds display
  - Laps table (lap split & total)
  - vClock-like digital style
*/

const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const msEl = document.getElementById('milliseconds');
const startStopBtn = document.getElementById('startStopBtn');
const resetLapBtn = document.getElementById('resetLapBtn');
const lapsContainer = document.getElementById('lapsContainer');

let timer = null;
let elapsedMs = 0;
let running = false;
let laps = [];
let lastLapMs = 0;

// Pad number to at least two digits
function pad(num, size = 2) {
  let s = "00" + num;
  return s.substr(s.length - size);
}

// Format milliseconds for display (2 digits)
function padMs(ms) {
  return pad(Math.floor(ms / 10), 2);
}

// Update the stopwatch display
function updateDisplay(ms) {
  const totalMs = ms;
  const h = Math.floor(totalMs / (60 * 60 * 1000));
  const m = Math.floor((totalMs % (60 * 60 * 1000)) / (60 * 1000));
  const s = Math.floor((totalMs % (60 * 1000)) / 1000);
  const ms2 = totalMs % 1000;

  hoursEl.textContent = pad(h);
  minutesEl.textContent = pad(m);
  secondsEl.textContent = pad(s);
  msEl.textContent = padMs(ms2);
}

// Start the stopwatch
function startTimer() {
  if (running) return;
  running = true;
  let prev = Date.now() - elapsedMs;
  timer = setInterval(() => {
    elapsedMs = Date.now() - prev;
    updateDisplay(elapsedMs);
  }, 10);

  // Change button appearance
  startStopBtn.textContent = "Stop";
  startStopBtn.classList.remove('start');
  startStopBtn.classList.add('stop');
  resetLapBtn.textContent = "Lap";
  resetLapBtn.classList.remove('reset');
  resetLapBtn.classList.add('lap');
}

// Stop the stopwatch
function stopTimer() {
  if (!running) return;
  running = false;
  clearInterval(timer);
  startStopBtn.textContent = "Start";
  startStopBtn.classList.remove('stop');
  startStopBtn.classList.add('start');
  resetLapBtn.textContent = "Reset";
  resetLapBtn.classList.remove('lap');
  resetLapBtn.classList.add('reset');
}

// Reset all
function resetTimer() {
  elapsedMs = 0;
  lastLapMs = 0;
  laps = [];
  updateDisplay(0);
  renderLaps();
}

// Lap logic
function addLap() {
  const lapTime = elapsedMs - (laps.length ? laps[laps.length-1].totalTime : 0);
  const lapObj = {
    num: laps.length + 1,
    lapTime: lapTime,
    totalTime: elapsedMs
  };
  laps.unshift(lapObj); // newest lap at top
  renderLaps();
}

// Render the laps table
function renderLaps() {
  if (laps.length === 0) {
    lapsContainer.innerHTML = "";
    return;
  }
  let html = `
    <table class="laps-table">
      <thead>
        <tr>
          <th>LAP</th>
          <th>TIME</th>
          <th>TOTAL TIME</th>
        </tr>
      </thead>
      <tbody>
  `;
  for (const lap of laps) {
    html += `
      <tr>
        <td>${lap.num}</td>
        <td>${formatTime(lap.lapTime)}</td>
        <td>${formatTime(lap.totalTime)}</td>
      </tr>
    `;
  }
  html += `</tbody></table>`;
  lapsContainer.innerHTML = html;
}
// Format time as 00:00:00.00
function formatTime(ms) {
  const h = Math.floor(ms / (60 * 60 * 1000));
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  const s = Math.floor((ms % (60 * 1000)) / 1000);
  const ms2 = Math.floor((ms % 1000) / 10);
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(ms2,2)}`;
}

// Button event handlers
startStopBtn.addEventListener('click', () => {
  if (!running) {
    startTimer();
  } else {
    stopTimer();
  }
});

resetLapBtn.addEventListener('click', () => {
  if (!running) {
    resetTimer();
  } else {
    addLap();
  }
});

// Initialize
updateDisplay(0);
renderLaps();
// Font size controls
let fontSizeVW = 12; // Default
const displayContainer = document.querySelector('.display-container');
function updateFontSize() {
  displayContainer.style.fontSize = fontSizeVW + 'vw';
}
document.getElementById('increaseFontBtn').onclick = function() {
  fontSizeVW = Math.min(fontSizeVW + 1, 18);
  updateFontSize();
};
document.getElementById('decreaseFontBtn').onclick = function() {
  fontSizeVW = Math.max(fontSizeVW - 1, 6);
  updateFontSize();
};
updateFontSize();

// Fullscreen control
document.getElementById('fullscreenBtn').onclick = function() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// Share control (copy current page URL)
document.getElementById('shareBtn').onclick = function() {
  navigator.clipboard.writeText(window.location.href);
  alert('URL copied to clipboard!');
};