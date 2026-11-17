/* =====================================================================
   Notepad + Corkboard + Leaderboard Drawers
   Load AFTER case-data.js and game.js (it uses CASE and state from them).
   ===================================================================== */

const notepadDrawer = document.getElementById('drawer-notepad');
const corkDrawer = document.getElementById('drawer-cork');
const leaderboardDrawer = document.getElementById('drawer-leaderboard');
const notepad = document.getElementById('notepad');
const NOTES_KEY = 'detective-desk-notes-' + (document.body.dataset.uid || '1');

/* ----- Open / close ----- */
function closeAllDrawers() {
  if (notepadDrawer) notepadDrawer.hidden = true;
  if (corkDrawer) corkDrawer.hidden = true;
  if (leaderboardDrawer) leaderboardDrawer.hidden = true;
}

function toggleDrawer(drawer) {
  if (!drawer) return;
  const willOpen = drawer.hidden;
  closeAllDrawers();
  drawer.hidden = !willOpen;
  if (willOpen && drawer === corkDrawer) refreshTools();
}

if (document.getElementById('btn-notepad')) {
  document.getElementById('btn-notepad').addEventListener('click', function () {
    toggleDrawer(notepadDrawer);
  });
}

if (document.getElementById('btn-cork')) {
  document.getElementById('btn-cork').addEventListener('click', function () {
    toggleDrawer(corkDrawer);
  });
}

document.querySelectorAll('[data-close]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    closeAllDrawers();
  });
});

/* ----- Notepad: saved automatically in this browser ----- */
if (notepad) {
  try {
    notepad.value = localStorage.getItem(NOTES_KEY) || '';
  } catch (e) {}

  notepad.addEventListener('input', function () {
    try {
      localStorage.setItem(NOTES_KEY, notepad.value);
    } catch (e) {}
  });
}

/* ----- Corkboard: one pin for each piece of evidence found ----- */
function refreshTools() {
  const countEl = document.getElementById('cork-count');
  if (countEl && typeof state !== 'undefined') {
    countEl.textContent = state.found.length;
  }

  const board = document.getElementById('cork-board');
  if (!board) return;

  if (typeof state === 'undefined' || state.found.length === 0) {
    board.innerHTML = '<p class="pin">No pins yet. Bag evidence at the crime scenes to pin forensic notes here.</p>';
    return;
  }

  let html = '';
  state.found.forEach(function (id) {
    const item = CASE.evidence[id];
    if (item) {
      html += '<div class="pin"><b>' + esc(item.name) + '</b><br>' + esc(item.text) + '</div>';
    }
  });
  board.innerHTML = html;
}

refreshTools();
