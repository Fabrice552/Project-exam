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
let zoomScale = 0.7; // Start at normal size
const mainContainer = document.querySelector('.container');
function updateZoom() {
  mainContainer.style.transform = `scale(${zoomScale})`;
  mainContainer.style.transformOrigin = 'top center';
}
document.getElementById('increaseFontBtn').onclick = function() {
  zoomScale = Math.min(zoomScale + 0.1, 2);
  updateZoom();
};
document.getElementById('decreaseFontBtn').onclick = function() {
  zoomScale = Math.max(zoomScale - 0.1, 0.5);
  updateZoom();
};
updateZoom();

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
document.getElementById('themeToggleBtn').addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 900;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.15;

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      ctx.close();
    }, 120);
  } catch (e) {
    // Ignore beep errors so stopwatch still works
  }
}
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 900;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.15;

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      ctx.close();
    }, 120);
  } catch (e) {
    
  }
}
 
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
  beep(); // <<< Call beep here, after everything else
}
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
  beep(); // <--- Beep for Stop
}
function resetTimer() {
  elapsedMs = 0;
  lastLapMs = 0;
  laps = [];
  updateDisplay(0);
  renderLaps();
  beep(); // <--- Beep for Reset
}
function addLap() {
  beep(); // <--- Beep for Lap
  const lapTime = elapsedMs - (laps.length ? laps[laps.length-1].totalTime : 0);
  const lapObj = {
    num: laps.length + 1,
    lapTime: lapTime,
    totalTime: elapsedMs
  };
  laps.unshift(lapObj); // newest lap at top
  renderLaps();
}
