<?php
/* ============ PHP: only logged-in users may enter ============ */
require 'db.php';

if (!isset($_SESSION['uid'])) {
  header('Location: login.php');
  exit;
}

$username = $_SESSION['name'];
$uid      = (int) $_SESSION['uid'];
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title data-i18n="game_title">Case File · The Detective's Desk</title>
  <script src="js/theme.js"></script>
  <link rel="stylesheet" href="css/style.css?v=3">
</head>
<body data-uid="<?= $uid ?>">

  <!-- Top bar -->
  <header class="nav">
    <a class="brand" href="game.php" data-i18n="title">The Detective's Desk</a>
    <span class="grow"></span>

    <button class="theme-toggle" type="button" aria-label="Switch to light mode">☀</button>

    <div class="lang-switch">
      <button class="lang-btn" type="button" onclick="setLanguage('en'); location.reload();">EN</button>
      <button class="lang-btn" type="button" onclick="setLanguage('bn'); location.reload();">বাংলা</button>
    </div>

    <span class="pill"><span data-i18n="score_label">Score:</span> <span id="score">0</span></span>
    <span class="muted"><span data-i18n="detective_label">Detective</span> <?= htmlspecialchars($username) ?></span>
    <a class="btn ghost" href="logout.php" data-i18n="sign_out">Sign out</a>
  </header>

  <main class="wrap">
    <p class="stamp" data-i18n="case_file">Case file</p>
    <h1 data-i18n="the_case">The Case</h1>

    <!-- Tabs -->
    <nav class="tabs">
      <button class="tab active" data-tab="scene" data-i18n="tab_scene">Scene</button>
      <button class="tab" data-tab="suspects" data-i18n="tab_suspects">Suspects</button>
      <button class="tab" data-tab="evidence" data-i18n="tab_evidence">Evidence</button>
      <button class="tab" data-tab="timeline" data-i18n="tab_timeline">Timeline</button>
      <button class="tab" data-tab="accuse" data-i18n="tab_accuse">Accuse</button>
    </nav>

    <!-- Panels -->
    <section class="panel" id="tab-scene">
      <h2 data-i18n="tab_scene">Scene</h2>
      <p class="muted" data-i18n="panel_scene_desc">Crime scenes will appear here.</p>
    </section>

    <section class="panel" id="tab-suspects" hidden>
      <h2 data-i18n="tab_suspects">Suspects</h2>
      <p class="muted" data-i18n="panel_suspects_desc">Suspects and interviews will appear here.</p>
    </section>

    <section class="panel" id="tab-evidence" hidden>
      <h2 data-i18n="tab_evidence">Evidence</h2>
      <p class="muted" data-i18n="panel_evidence_desc">Collected evidence will appear here.</p>
    </section>

    <section class="panel" id="tab-timeline" hidden>
      <h2 data-i18n="tab_timeline">Timeline</h2>
      <p class="muted" data-i18n="panel_timeline_desc">The timeline of events will appear here.</p>
    </section>

    <section class="panel" id="tab-accuse" hidden>
      <h2 data-i18n="tab_accuse">Accuse</h2>
      <p class="muted" data-i18n="panel_accuse_desc">Name the criminal and the motive here.</p>
    </section>
  </main>

  <!-- Notepad + Corkboard buttons -->
  <div class="desk-tools">
    <button class="btn ghost" id="btn-notepad" data-i18n="btn_notepad">Notepad</button>
    <button class="btn ghost" id="btn-cork"><span data-i18n="btn_cork">Corkboard</span> <span id="cork-count">0</span></button>
  </div>

  <aside class="drawer" id="drawer-notepad" hidden>
    <div class="drawer-head">
      <h3 data-i18n="notepad_title">Detective notepad</h3>
      <button class="btn ghost" data-close data-i18n="btn_close">Close</button>
    </div>
    <textarea id="notepad" data-i18n-placeholder="notepad_placeholder" placeholder="Write your theories, times and names here..."></textarea>
    <p class="muted" data-i18n="notepad_saved">Saved automatically in this browser.</p>
  </aside>

  <aside class="drawer" id="drawer-cork" hidden>
    <div class="drawer-head">
      <h3 data-i18n="evidence_board">Evidence corkboard</h3>
      <button class="btn ghost" data-close data-i18n="btn_close">Close</button>
    </div>
    <div class="cork" id="cork-board"></div>
  </aside>

  <!-- JS Files -->
  <script src="js/lang.js"></script>
  <script src="js/case-data.js"></script>
  <script src="js/game.js"></script>
  <script src="js/tools.js"></script>
</body>
</html>