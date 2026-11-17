<?php
// Stop the browser from caching private pages.
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database configuration supporting both local XAMPP and Cloud MySQL environment variables
$db_host = getenv('MYSQL_HOST') ?: (getenv('DB_HOST') ?: 'localhost');
$db_port = getenv('MYSQL_PORT') ?: (getenv('DB_PORT') ?: '3306');
$db_name = getenv('MYSQL_DATABASE') ?: (getenv('DB_NAME') ?: 'detective_desk');
$db_user = getenv('MYSQL_USER') ?: (getenv('DB_USER') ?: 'root');
$db_pass = getenv('MYSQL_PASSWORD') ?: (getenv('DB_PASSWORD') ?: '');

// Check connection string URL (e.g. TiDB, Aiven, PlanetScale)
$db_url = getenv('MYSQL_URL') ?: getenv('DATABASE_URL');
if ($db_url && strpos($db_url, 'mysql://') === 0) {
    $parsed = parse_url($db_url);
    if ($parsed) {
        $db_host = $parsed['host'] ?? $db_host;
        $db_port = $parsed['port'] ?? $db_port;
        $db_user = $parsed['user'] ?? $db_user;
        $db_pass = $parsed['pass'] ?? $db_pass;
        $db_name = ltrim($parsed['path'] ?? $db_name, '/');
    }
}

try {
    $dsn = "mysql:host={$db_host};port={$db_port};dbname={$db_name};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    
    // Enable SSL if running on cloud database
    if (getenv('MYSQL_SSL') === 'true' || getenv('TIDB_ENABLE_SSL') === 'true') {
        $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
    }
    
    $db = new PDO($dsn, $db_user, $db_pass, $options);
} catch (PDOException $e) {
    // Graceful error message with helpful guidance
    die(
        '<div style="font-family:sans-serif;max-width:600px;margin:50px auto;padding:24px;background:#1e1a17;color:#eaddc5;border:1px solid #7a5c3c;border-radius:8px;line-height:1.6">' .
        '<h2 style="color:#d4a373;margin-top:0">🕵️ The Detective Desk: Database Connection Notice</h2>' .
        '<p>Could not connect to MySQL database: <code>' . htmlspecialchars($e->getMessage()) . '</code></p>' .
        '<p><b>Quick Fixes:</b></p>' .
        '<ul>' .
        '<li><b>If testing locally in XAMPP:</b> Make sure MySQL is running in XAMPP and import <code>database.sql</code> into phpMyAdmin.</li>' .
        '<li><b>If deploying to Vercel:</b> Vercel runs the native Node.js Serverless API located in <code>/api</code>! Please open <a href="index.html" style="color:#d4a373">index.html</a> or run <code>npm start</code> to test the Vercel-ready version.</li>' .
        '</ul></div>'
    );
}
