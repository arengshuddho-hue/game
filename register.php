<?php
require 'db.php';

$error_key = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = trim($_POST['username'] ?? '');
  $email    = trim($_POST['email'] ?? '');
  $password = $_POST['password'] ?? '';

  if (!preg_match('/^[A-Za-z0-9_]{3,30}$/', $username)) {
    $error_key = 'err_username';
  } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $error_key = 'err_email';
  } elseif (strlen($password) < 6) {
    $error_key = 'err_password';
  } else {
    // Check if username or email is already taken
    $check = $db->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
    $check->execute([$username, $email]);

    if ($check->fetch()) {
      $error_key = 'err_taken';
    } else {
      // Save the new user with a hashed password
      $insert = $db->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
      $insert->execute([$username, $email, password_hash($password, PASSWORD_DEFAULT)]);

      // Log the user in right away
      $_SESSION['uid']  = (int) $db->lastInsertId();
      $_SESSION['name'] = $username;

      header('Location: game.php');
      exit;
    }
  }
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title data-i18n="reg_title">Join · The Detective's Desk</title>
  <script src="js/theme.js"></script>
  <link rel="stylesheet" href="css/style.css?v=3">
</head>
<body class="auth">
  <form class="card" method="post" autocomplete="off">
    <div class="lang-bar">
      <button type="button" class="theme-toggle" aria-label="Switch to light mode">☀</button>
      <button type="button" class="lang-btn" onclick="setLanguage('en')">EN</button>
      <button type="button" class="lang-btn" onclick="setLanguage('bn')">বাংলা</button>
    </div>

    <a class="brand" href="index.html" data-i18n="title">The Detective's Desk</a>
    <h1 data-i18n="reg_heading">Open your file</h1>
    <p class="muted" data-i18n="reg_sub">Create an account to start investigating.</p>

    <?php if ($error_key): ?>
      <p class="err" data-i18n="<?= htmlspecialchars($error_key) ?>">Error</p>
    <?php endif; ?>

    <label>
      <span data-i18n="lbl_username">Username</span>
      <input name="username" required value="<?= htmlspecialchars($_POST['username'] ?? '') ?>">
    </label>
    <label>
      <span data-i18n="lbl_email">Email</span>
      <input type="email" name="email" required value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
    </label>
    <label>
      <span data-i18n="lbl_password">Password</span>
      <input type="password" name="password" required minlength="6">
    </label>

    <button class="btn" type="submit" data-i18n="btn_create_acc">Create account</button>
    <p class="muted">
      <span data-i18n="already_acc">Already have an account?</span>
      <a href="login.php" data-i18n="sign_in">Sign in</a>
    </p>
  </form>

  <script src="js/lang.js"></script>
</body>
</html>