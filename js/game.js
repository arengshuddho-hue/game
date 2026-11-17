/* =====================================================================
   The Detective's Desk: Enhanced Game Engine v2.0
   Multiple Cases, Server Score Sync, Noir Audio System, Leaderboard
   ===================================================================== */

/* ---------- Language Setup for Dynamic HTML ---------- */
let uiLang = localStorage.getItem('preferredLang') || 'en';
const UI_TEXT = {
  en: {
    scenesTitle: "Crime Scene Inspection", scenesHelp: "Click the glowing forensic reticles to bag evidence. Found: ", evidenceTitle: "Evidence Vault", evidenceEmpty: "No evidence bagged yet. Search the crime scenes first.",
    suspectsTitle: "Persons of Interest", suspectsHelp: "Select someone to interrogate. Ask every question to crack a suspect (+5 points each). Cracked: ", alibi: "Alibi:", pickSuspect: "Pick a suspect above to start the interrogation.",
    timelineTitle: "Chronological Sequence of Events", caseClosedWin: "Case Closed. Culprit Identified & Indicted.", caseClosedLose: "Case Closed. False Accusation / Cold Trail.", evBagged: "Evidence bagged", susCracked: "Suspects cracked",
    correctCulprit: "Correct culprit:", motiveProven: "Motive proven:", truth: "The truth:", playAgain: "Reinvestigate this case", nextCase: "Next Case Dossier ➔", startOver: "Restart from Case 1",
    accuseTitle: "Formal Indictment & Arrest Warrant", accuseHelp: "Name the culprit and establish the true motive. You only get one official accusation.", iAccuse: "I formally accuse", motiveWas: "The motive was",
    accuseErr: "Please select both a prime suspect and their motive.", closeCaseBtn: "File Arrest Warrant & Close Case", youHaveBagged: "You have bagged ", piecesOfEv: " pieces of evidence and cracked ",
    suspectsDot: " suspects.", confirmReset: "Erase your progress on this case and re-open investigation?", casePrefix: "CASE DOSSIER #"
  },
  bn: {
    scenesTitle: "অপরাধের ঘটনাস্থল তল্লাশি", scenesHelp: "প্রমাণ সংগ্রহ করতে উজ্জ্বল বৃত্তগুলোতে ক্লিক করো। সংগৃহীত: ", evidenceTitle: "ফরেনসিক প্রমাণ ভল্ট", evidenceEmpty: "এখনো কোনো প্রমাণ সংগ্রহ করা হয়নি। প্রথমে অপরাধের দৃশ্যগুলোতে অনুসন্ধান করো।",
    suspectsTitle: "সন্দেহভাজন ব্যক্তিবর্গ", suspectsHelp: "জিজ্ঞাসাবাদের জন্য একজনকে নির্বাচন করো। একটি সন্দেহভাজনকে ক্র্যাক করতে সব প্রশ্ন করো (+৫ পয়েন্ট করে)। ক্র্যাকড: ", alibi: "অ্যালিবি:", pickSuspect: "জিজ্ঞাসাবাদ শুরু করতে ওপর থেকে একজন সন্দেহভাজনকে নির্বাচন করো।",
    timelineTitle: "ঘটনার কালানুক্রমিক টাইমলাইন", caseClosedWin: "কেস ক্লোজড। তুমি সঠিক অপরাধীকে চিহ্নিত ও গ্রেফতার করেছ।", caseClosedLose: "কেস ক্লোজড। ভুল অভিযোগ / অপরাধী পালিয়ে গেছে।", evBagged: "সংগৃহীত প্রমাণ", susCracked: "ক্র্যাক করা সন্দেহভাজন",
    correctCulprit: "সঠিক অপরাধী:", motiveProven: "প্রমাণিত উদ্দেশ্য:", truth: "আসল সত্য:", playAgain: "এই কেসটি আবার তদন্ত করো", nextCase: "পরবর্তী কেস ডসিয়ার ➔", startOver: "১ম কেস থেকে শুরু করো",
    accuseTitle: "চূড়ান্ত অভিযোগ ও গ্রেফতারি পরোয়ানা", accuseHelp: "অপরাধী এবং উদ্দেশ্য শনাক্ত করো। তুমি মাত্র একবার অভিযোগ করার সুযোগ পাবে।", iAccuse: "আমার আনুষ্ঠানিক অভিযোগ", motiveWas: "তার আসল উদ্দেশ্য ছিল",
    accuseErr: "দয়া করে একজন প্রধান সন্দেহভাজন এবং একটি উদ্দেশ্য নির্বাচন করো।", closeCaseBtn: "গ্রেফতারি পরোয়ানা জারি করো", youHaveBagged: "তুমি ", piecesOfEv: " টি প্রমাণ সংগ্রহ করেছ এবং ",
    suspectsDot: " জন সন্দেহভাজনকে ক্র্যাক করেছ।", confirmReset: "এই কেসের সব প্রোগ্রেস মুছে ফেলে আবার নতুন করে শুরু করতে চাও?", casePrefix: "কেস ডসিয়ার নং "
  }
};
let t = UI_TEXT[uiLang] || UI_TEXT.en;

function esc(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

/* ---------- Audio System (Music + SFX Master Controls) ---------- */
const sfx = {
  click: new Audio('assets/audio/click.mp3'),
  ask: new Audio('assets/audio/ask.mp3'),
  found: new Audio('assets/audio/found.mp3'),
  bg: new Audio('assets/audio/bg-music.mp3')
};

sfx.bg.loop = true;
sfx.bg.volume = 0.22;

let musicEnabled = localStorage.getItem('detective_music') !== 'false';
let sfxEnabled = localStorage.getItem('detective_sfx') !== 'false';

function updateAudioUI() {
  const eq = document.getElementById('audio-eq');
  const mIcon = document.getElementById('music-icon');
  const sIcon = document.getElementById('sfx-icon');

  if (eq) eq.classList.toggle('paused', !musicEnabled || sfx.bg.paused);
  if (mIcon) mIcon.textContent = musicEnabled ? '🎵' : '🔇';
  if (sIcon) sIcon.textContent = sfxEnabled ? '🔔' : '🔕';
}

function playSound(type) {
  if (!sfxEnabled) return;
  if (sfx[type]) {
    sfx[type].currentTime = 0;
    sfx[type].play().catch(() => {});
  }
}

function toggleMusic() {
  musicEnabled = !musicEnabled;
  localStorage.setItem('detective_music', musicEnabled);
  if (musicEnabled) {
    sfx.bg.play().catch(() => {});
  } else {
    sfx.bg.pause();
  }
  updateAudioUI();
}

function toggleSFX() {
  sfxEnabled = !sfxEnabled;
  localStorage.setItem('detective_sfx', sfxEnabled);
  updateAudioUI();
}

// User interaction unlocks audio
let bgStarted = false;
function initAudioOnUserInteraction() {
  if (!bgStarted && musicEnabled) {
    sfx.bg.play().then(() => {
      bgStarted = true;
      updateAudioUI();
    }).catch(() => {});
  }
}
document.body.addEventListener('click', initAudioOnUserInteraction, { once: true });

/* ---------- Saved progress (Case Index & State) ---------- */
function getUid() {
  return document.body.dataset.uid || '1';
}

function getStateKey() {
  return 'detective-desk-state-' + getUid() + '-case-' + currentCaseIndex;
}

const KEY_CASE = 'detective-desk-caseIndex-' + getUid();
let currentCaseIndex = parseInt(localStorage.getItem(KEY_CASE) || '0');

let activeCases = (uiLang === 'bn') ? CASES_BN : CASES_EN;
if (currentCaseIndex >= activeCases.length) currentCaseIndex = 0;
let CASE = activeCases[currentCaseIndex];

function loadState() {
  const fresh = { found: [], asked: {}, result: null };
  try {
    return Object.assign(fresh, JSON.parse(localStorage.getItem(getStateKey()) || '{}'));
  } catch (e) {
    return fresh;
  }
}
let state = loadState();

function saveState() {
  localStorage.setItem(getStateKey(), JSON.stringify(state));
  localStorage.setItem(KEY_CASE, currentCaseIndex);
}

/* ---------- Score & Detective Rank ---------- */
function askedCount(suspect) {
  return (state.asked[suspect.id] || []).length;
}

function isCracked(suspect) {
  return askedCount(suspect) >= suspect.qa.length;
}

function crackedCount() {
  return CASE.suspects.filter(isCracked).length;
}

function calcScore() {
  let total = state.found.length * 5 + crackedCount() * 5;
  if (state.result) total += (state.result.culpritPoints || 0) + (state.result.motivePoints || 0);
  return total;
}

function updateDetectiveRank(score) {
  const badge = document.getElementById('det-rank-badge');
  if (!badge) return;
  if (score >= 160) badge.textContent = '🏆';
  else if (score >= 90) badge.textContent = '🎖️';
  else if (score >= 40) badge.textContent = '🕵️';
  else badge.textContent = '🔍';
}

function updateScore() {
  const score = calcScore();
  const el = document.getElementById('score');
  if (el) el.textContent = score;
  updateDetectiveRank(score);
  if (window.refreshTools) refreshTools();
}

/* ---------- Server Score Sync ---------- */
async function syncScoreToServer(caseNum, score, culprit, motive) {
  try {
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseNumber: caseNum, score, culprit, motive })
    });
    if (res.ok) {
      console.log('Score synced to bureau archive.');
    }
  } catch (e) {
    console.warn('Offline mode: score saved locally.');
  }
}

/* ---------- Case Selector UI ---------- */
function renderCaseSelector() {
  const bar = document.getElementById('case-selector-bar');
  if (!bar) return;

  let html = '';
  activeCases.forEach((c, idx) => {
    const isActive = idx === currentCaseIndex;
    const isSolved = Boolean((JSON.parse(localStorage.getItem('detective-desk-state-' + getUid() + '-case-' + idx) || '{}')).result);
    const badge = isSolved ? '✓ ' : '';
    html += `<button class="case-btn ${isActive ? 'active' : ''}" data-case="${idx}">
      ${badge}#${c.number}: ${esc(c.title.split(' ')[0])}...
    </button>`;
  });
  bar.innerHTML = html;
}

if (document.getElementById('case-selector-bar')) {
  document.getElementById('case-selector-bar').addEventListener('click', (e) => {
    const btn = e.target.closest('.case-btn');
    if (!btn) return;
    const idx = parseInt(btn.dataset.case);
    if (idx !== currentCaseIndex && idx < activeCases.length) {
      playSound('click');
      currentCaseIndex = idx;
      CASE = activeCases[currentCaseIndex];
      state = loadState();
      saveState();
      currentSuspect = null;
      renderAll();
      openTab('scene');
    }
  });
}

/* ---------- Tabs System ---------- */
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

function openTab(name) {
  playSound('click');
  tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === name));
  panels.forEach(panel => panel.hidden = (panel.id !== 'tab-' + name));
}
tabs.forEach(tab => tab.addEventListener('click', () => openTab(tab.dataset.tab)));

/* ---------- Scene tab ---------- */
function renderScenes() {
  const total = Object.keys(CASE.evidence).length;
  let html = `<h2>${t.scenesTitle}</h2><p class="muted">${esc(CASE.intro)}</p>`;
  html += `<p class="muted">${t.scenesHelp}<b id="found-count">${state.found.length}</b> / ${total}</p>`;
  html += `<div id="scene-msg"></div><div class="scenes">`;

  CASE.scenes.forEach(scene => {
    html += `<div class="scene">
      <img src="${scene.img}" alt="${esc(scene.name)}">
      <h3>${esc(scene.name)}</h3>`;
    scene.hotspots.forEach(h => {
      const found = state.found.indexOf(h.ev) !== -1;
      html += `<button class="hot${found ? ' found' : ''}" data-ev="${h.ev}" style="left:${h.x}%;top:${h.y}%;" title="Inspect forensic hotspot"></button>`;
    });
    html += `</div>`;
  });
  document.getElementById('tab-scene').innerHTML = html + `</div>`;
}

document.getElementById('tab-scene').addEventListener('click', function (event) {
  const btn = event.target.closest('.hot');
  if (!btn) return;
  const id = btn.dataset.ev;
  const item = CASE.evidence[id];
  if (!item) return;

  document.getElementById('scene-msg').innerHTML = `<div class="note"><b>${esc(item.name)}</b><br>${esc(item.text)}</div>`;

  if (state.result || state.found.indexOf(id) !== -1) return;

  playSound('found');
  state.found.push(id);
  saveState();
  btn.classList.add('found');
  document.getElementById('found-count').textContent = state.found.length;
  renderEvidence();
  renderAccuse();
  updateScore();
});

/* ---------- Evidence tab ---------- */
function renderEvidence() {
  let html = `<h2>${t.evidenceTitle}</h2>`;
  if (state.found.length === 0) {
    html += `<p class="muted">${t.evidenceEmpty}</p>`;
  } else {
    html += `<div class="list">`;
    state.found.forEach(id => {
      const item = CASE.evidence[id];
      if (item) {
        html += `<div class="note"><b>${esc(item.name)}</b><br>${esc(item.text)}</div>`;
      }
    });
    html += `</div>`;
  }
  document.getElementById('tab-evidence').innerHTML = html;
}

/* ---------- Suspects tab ---------- */
let currentSuspect = null;
function renderSuspects() {
  let html = `<h2>${t.suspectsTitle}</h2><p class="muted">${t.suspectsHelp}<b>${crackedCount()}</b> / ${CASE.suspects.length}</p><div class="sus-grid">`;
  CASE.suspects.forEach(s => {
    const cls = 'sus' + (s.id === currentSuspect ? ' active' : '') + (isCracked(s) ? ' cracked' : '');
    html += `<button class="${cls}" data-sus="${s.id}">
      <img src="${s.img}" alt="${esc(s.name)}">
      <b>${esc(s.name)}</b>
      <small>${esc(s.role)}</small>
    </button>`;
  });
  html += `</div>`;

  if (currentSuspect) {
    const s = CASE.suspects.find(x => x.id === currentSuspect);
    if (s) {
      const asked = state.asked[s.id] || [];
      html += `<div class="card">
        <h3>${esc(s.name)} <span class="muted" style="font-size:0.95rem;">(${esc(s.role)})</span></h3>
        <p class="muted" style="text-align:left;">${esc(s.tie)}</p>
        <p><b>${t.alibi}</b> ${esc(s.alibi)}</p>`;
      
      s.qa.forEach((item, i) => {
        const done = asked.indexOf(i) !== -1;
        html += `<button class="q${done ? ' done' : ''}" data-q="${i}">${esc(item.q)}</button>`;
      });

      html += `<div class="log">`;
      asked.forEach(i => {
        if (s.qa[i]) {
          html += `<p><b>Q: ${esc(s.qa[i].q)}</b><br>A: ${esc(s.qa[i].a)}</p>`;
        }
      });
      html += `</div></div>`;
    }
  } else {
    html += `<p class="muted">${t.pickSuspect}</p>`;
  }
  document.getElementById('tab-suspects').innerHTML = html;
}

document.getElementById('tab-suspects').addEventListener('click', function (event) {
  const susBtn = event.target.closest('.sus');
  if (susBtn) {
    currentSuspect = susBtn.dataset.sus;
    renderSuspects();
    return;
  }

  const qBtn = event.target.closest('.q');
  if (qBtn && currentSuspect) {
    playSound('ask');
    const i = Number(qBtn.dataset.q);
    state.asked[currentSuspect] = state.asked[currentSuspect] || [];
    if (!state.result && state.asked[currentSuspect].indexOf(i) === -1) {
      state.asked[currentSuspect].push(i);
      saveState();
    }
    renderSuspects();
    updateScore();
  }
});

/* ---------- Timeline tab ---------- */
function renderTimeline() {
  let html = `<h2>${t.timelineTitle}</h2><ul class="timeline">`;
  CASE.timeline.forEach(tm => {
    html += `<li><b>${esc(tm.time)}</b><br>${esc(tm.event)}</li>`;
  });
  document.getElementById('tab-timeline').innerHTML = html + `</ul>`;
}

/* ---------- Accuse tab ---------- */
function renderAccuse() {
  const box = document.getElementById('tab-accuse');

  if (state.result) {
    const r = state.result;
    const culprit = CASE.suspects.find(s => s.id === CASE.culprit) || { name: CASE.culprit };
    let html = `<div class="verdict">
      <h2>${r.culpritPoints ? t.caseClosedWin : t.caseClosedLose}</h2>
      <p class="big-score">${calcScore()} / ${CASE.maxScore}</p>
    </div>`;

    html += `<div class="card"><div class="list">
      <p>${t.evBagged} (${state.found.length} × 5): <b>${state.found.length * 5} pts</b></p>
      <p>${t.susCracked} (${crackedCount()} × 5): <b>${crackedCount() * 5} pts</b></p>
      <p class="${r.culpritPoints ? 'good' : 'bad'}">${t.correctCulprit} <b>+${r.culpritPoints} pts</b></p>
      <p class="${r.motivePoints ? 'good' : 'bad'}">${t.motiveProven} <b>+${r.motivePoints} pts</b></p>
    </div></div>`;

    html += `<div class="note"><b>${t.truth} ${esc(culprit.name)}</b><br>${esc(CASE.solution)}</div>`;
    
    html += `<div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-top:24px;">`;
    html += `<button class="btn ghost" id="reset-btn">${t.playAgain}</button>`;
    if (r.culpritPoints) {
      if (currentCaseIndex < activeCases.length - 1) {
        html += `<button class="btn" id="next-case-btn">${t.nextCase}</button>`;
      } else {
        html += `<button class="btn" id="restart-all-btn">${t.startOver}</button>`;
      }
    }
    html += `</div>`;
    
    box.innerHTML = html;
    return;
  }

  let html = `<h2>${t.accuseTitle}</h2><p class="muted">${t.accuseHelp}</p>`;
  html += `<p><b>${t.iAccuse}:</b></p><div class="opts">`;
  CASE.suspects.forEach(s => {
    html += `<label class="opt">
      <input type="radio" name="suspect" value="${s.id}">
      <span><b>${esc(s.name)}</b> <span class="muted">(${esc(s.role)})</span></span>
    </label>`;
  });
  html += `</div><p><b>${t.motiveWas}:</b></p><div class="opts">`;
  CASE.motives.forEach(m => {
    html += `<label class="opt">
      <input type="radio" name="motive" value="${m.id}">
      <span>${esc(m.label)}</span>
    </label>`;
  });
  html += `</div><p id="accuse-err" class="err" hidden>${t.accuseErr}</p>`;
  html += `<button class="btn big" id="accuse-btn" style="margin: 0 auto; display: flex;">${t.closeCaseBtn}</button>`;
  html += `<p class="muted" style="margin-top:16px;">${t.youHaveBagged}<b>${state.found.length} / ${Object.keys(CASE.evidence).length}</b>${t.piecesOfEv}<b>${crackedCount()} / ${CASE.suspects.length}</b>${t.suspectsDot}</p>`;
  box.innerHTML = html;
}

document.getElementById('tab-accuse').addEventListener('click', function (event) {
  if (event.target.id === 'reset-btn') {
    if (confirm(t.confirmReset)) {
      state = { found: [], asked: {}, result: null };
      saveState();
      currentSuspect = null;
      renderAll();
      openTab('scene');
    }
    return;
  }
  if (event.target.id === 'next-case-btn') {
    currentCaseIndex++;
    CASE = activeCases[currentCaseIndex];
    state = loadState();
    saveState();
    currentSuspect = null;
    renderAll();
    openTab('scene');
    return;
  }
  if (event.target.id === 'restart-all-btn') {
    currentCaseIndex = 0;
    CASE = activeCases[currentCaseIndex];
    state = loadState();
    saveState();
    currentSuspect = null;
    renderAll();
    openTab('scene');
    return;
  }
  if (event.target.id !== 'accuse-btn') return;

  const suspect = document.querySelector('input[name="suspect"]:checked');
  const motive = document.querySelector('input[name="motive"]:checked');
  if (!suspect || !motive) {
    document.getElementById('accuse-err').hidden = false;
    return;
  }

  const culpritPoints = suspect.value === CASE.culprit ? 60 : 0;
  const motivePoints = motive.value === CASE.correctMotive ? 15 : 0;

  state.result = {
    suspect: suspect.value,
    motive: motive.value,
    culpritPoints,
    motivePoints
  };
  saveState();
  renderAll();

  // Sync to database
  const finalCaseScore = calcScore();
  syncScoreToServer(CASE.number, finalCaseScore, suspect.value, motive.value);
});

/* ---------- Start & Master Render ---------- */
function renderAll() {
  const isSolved = state.result && state.result.culpritPoints > 0;
  const stampEl = document.getElementById('case-stamp');
  const titleEl = document.getElementById('case-title');

  if (titleEl) titleEl.textContent = CASE.title;
  if (stampEl) {
    stampEl.textContent = `${t.casePrefix}${CASE.number} · ${isSolved ? (uiLang === 'bn' ? 'মীমাংসিত / সমাধান' : 'CASE SOLVED') : CASE.stamp}`;
    stampEl.classList.toggle('solved', Boolean(isSolved));
  }

  renderCaseSelector();
  renderScenes();
  renderSuspects();
  renderEvidence();
  renderTimeline();
  renderAccuse();
  updateScore();
}

/* ---------- Audio Control Listeners ---------- */
const musicBtn = document.getElementById('btn-toggle-music');
const sfxBtn = document.getElementById('btn-toggle-sfx');
if (musicBtn) musicBtn.addEventListener('click', toggleMusic);
if (sfxBtn) sfxBtn.addEventListener('click', toggleSFX);
updateAudioUI();

/* ---------- Leaderboard Drawer Hook ---------- */
const lbBtn = document.getElementById('btn-leaderboard');
const lbDrawer = document.getElementById('drawer-leaderboard');
if (lbBtn && lbDrawer) {
  lbBtn.addEventListener('click', async () => {
    lbDrawer.hidden = false;
    const content = document.getElementById('leaderboard-content');
    content.innerHTML = `<p class="muted">Accessing bureau central archives...</p>`;
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (data.success && data.leaderboard && data.leaderboard.length) {
        let html = '<div class="list" style="display:flex; flex-direction:column; gap:10px;">';
        data.leaderboard.forEach((lead, rank) => {
          const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '🎖️';
          html += `<div class="note" style="margin:0; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
            <span>${medal} <b>${esc(lead.username)}</b></span>
            <span class="pill">${lead.score || 0} pts</span>
          </div>`;
        });
        content.innerHTML = html + '</div>';
      } else {
        content.innerHTML = '<p class="muted">No bureau records found yet. Crack a case to be first!</p>';
      }
    } catch (e) {
      content.innerHTML = '<p class="err">Could not retrieve records.</p>';
    }
  });
}

// Language reload hook
window.onLanguageChanged = function (lang) {
  uiLang = lang;
  t = UI_TEXT[uiLang] || UI_TEXT.en;
  activeCases = (uiLang === 'bn') ? CASES_BN : CASES_EN;
  CASE = activeCases[currentCaseIndex];
  renderAll();
};

renderAll();
