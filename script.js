// ===== CONFIG =====
const ATTENDANCE_GOAL = 50;
const STORAGE_KEY = "intelSummitCheckIn";

const TEAM_LABELS = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

// ===== STATE =====
let state = {
  total: 0,
  teams: {
    water: 0,
    zero: 0,
    power: 0,
  },
  attendees: [], // [{ name: "Ada", team: "water" }, ...]
  celebrated: false,
};

// ===== DOM REFERENCES (matched to your HTML ids) =====
const checkInForm = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCountEl = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCountEl = document.getElementById("waterCount");
const zeroCountEl = document.getElementById("zeroCount");
const powerCountEl = document.getElementById("powerCount");
const attendeeListEl = document.getElementById("attendeeList");
const resetBtn = document.getElementById("resetBtn");

// ===== LOCAL STORAGE (LevelUp: Save Your Progress) =====
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    state = JSON.parse(saved);
  }
}

// ===== RENDERING =====
function render() {
  attendeeCountEl.textContent = state.total;

  const percent = Math.min((state.total / ATTENDANCE_GOAL) * 100, 100);
  progressBar.style.width = `${percent}%`;

  waterCountEl.textContent = state.teams.water;
  zeroCountEl.textContent = state.teams.zero;
  powerCountEl.textContent = state.teams.power;

  renderAttendeeList();
  checkCelebration();
}

// ===== ATTENDEE LIST (LevelUp: Attendee List) =====
function renderAttendeeList() {
  attendeeListEl.innerHTML = "";

  state.attendees.forEach(function (person) {
    const li = document.createElement("li");
    li.textContent = `${person.name} — ${TEAM_LABELS[person.team]}`;
    attendeeListEl.appendChild(li);
  });
}

// ===== CELEBRATION (LevelUp: Celebration Feature) =====
function checkCelebration() {
  if (state.total >= ATTENDANCE_GOAL) {
    const winningTeamKey = Object.keys(state.teams).reduce((a, b) =>
      state.teams[a] >= state.teams[b] ? a : b,
    );

    greeting.textContent = `🎉 Attendance goal reached! ${TEAM_LABELS[winningTeamKey]} is leading the Summit!`;
    state.celebrated = true;
    saveState();
    resetBtn.style.display = "block";
  } else {
    resetBtn.style.display = "none";
  }
}

// ===== RESET FOR NEXT ROUND =====
function handleReset() {
  const confirmed = confirm(
    "This will clear all check-in data and start a new round. Continue?",
  );
  if (!confirmed) return;

  state = {
    total: 0,
    teams: { water: 0, zero: 0, power: 0 },
    attendees: [],
    celebrated: false,
  };

  localStorage.removeItem(STORAGE_KEY);
  greeting.textContent = "";
  resetBtn.style.display = "none";
  render();
}

resetBtn.addEventListener("click", handleReset);

// ===== CHECK-IN LOGIC =====
checkInForm.addEventListener("submit", function (e) {
  e.preventDefault(); // stops the form from refreshing the page

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) {
    return;
  }

  // Update state
  state.total += 1;
  state.teams[team] += 1;
  state.attendees.push({ name, team });

  // Greeting message (only overwritten by celebration once goal is hit)
  if (state.total < ATTENDANCE_GOAL) {
    greeting.textContent = `Welcome, ${name}! Thanks for joining ${TEAM_LABELS[team]}.`;
  }

  saveState();
  render();

  // Reset the form for the next person
  checkInForm.reset();
  nameInput.focus();
});

// ===== INIT =====
loadState();
render();
