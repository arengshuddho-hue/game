<?php
require_once 'db.php';
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'status' => 'success',
    'message' => 'PHP & Database connected successfully!',
    'engine' => 'PHP ' . PHP_VERSION,
    'session_user' => $_SESSION['name'] ?? null
]);
