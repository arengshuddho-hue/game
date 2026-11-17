<?php
require 'db.php';

$error_key = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $identity = trim($_POST['identity'] ?? '');
  $password = $_POST['password'] ?? '';

  // Find the user by username or email
  $query = $db->prepare('SELECT * FROM users WHERE username = ? OR email = ?');
  $query->execute([$identity, $identity]);
  $user = $query->fetch();

  // Compare the typed password with the stored hash
  if ($user && password_verify($password, $user['password_hash'])) {
    session_regenerate_id(true);
    $_SESSION['uid']  = (int) $user['id'];
    $_SESSION['name'] = $user['username'];

    header('Location: game.php');
    exit;
  }

  $error_key = 'err_login';
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title data-i18n="login_title">Sign in · The Detective's Desk</title>
  <script src="js/theme.js"></script>
  <link rel="stylesheet" href="css/style.css?v=3">
</head>
<body class="auth">
  <form class="card" method="post">
    <div class="lang-bar">
      <button type="button" class="theme-toggle" aria-label="Switch to light mode">☀</button>
      <button type="button" class="lang-btn" onclick="setLanguage('en')">EN</button>
      <button type="button" class="lang-btn" onclick="setLanguage('bn')">বাংলা</button>
    </div>

    <a class="brand" href="index.html" data-i18n="title">The Detective's Desk</a>
    <h1 data-i18n="login_heading">Welcome back, detective</h1>
    <p class="muted" data-i18n="login_sub">Your case file is waiting for you.</p>

    <?php if ($error_key): ?>
      <p class="err" data-i18n="<?= htmlspecialchars($error_key) ?>">Error</p>
    <?php endif; ?>

    <label>
      <span data-i18n="lbl_identity">Username or email</span>
      <input name="identity" required value="<?= htmlspecialchars($_POST['identity'] ?? '') ?>">
    </label>
    <label>
      <span data-i18n="lbl_password">Password</span>
      <input type="password" name="password" required>
    </label>

    <button class="btn" type="submit" data-i18n="btn_signin">Sign in</button>
    <p class="muted">
      <span data-i18n="new_here">New here?</span>
      <a href="register.php" data-i18n="create_acc">Create an account</a>
    </p>
  </form>

  <script src="js/lang.js"></script>
</body>
</html>