-- =======================================================
-- The Detective's Desk: Complete Database Schema
-- Compatible with MySQL 5.7+, 8.0+, MariaDB, TiDB & Cloud MySQL
-- =======================================================

CREATE DATABASE IF NOT EXISTS detective_desk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE detective_desk;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Case Investigation Records
CREATE TABLE IF NOT EXISTS case_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  case_number INT NOT NULL,
  score INT NOT NULL DEFAULT 0,
  culprit VARCHAR(100) DEFAULT NULL,
  motive VARCHAR(100) DEFAULT NULL,
  solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  CONSTRAINT fk_case_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Default Demo Accounts
-- Passwords:
-- detective / sherlock123
-- investigator / detective123
INSERT INTO users (username, email, password_hash, score)
VALUES
  ('detective', 'detective@desk.noir', '$2a$10$wT8Kj7M8e6aR1U4eW7A03uxE.JdGz1M0KxIbm0g78LzO1W6c7f1aC', 125),
  ('investigator', 'investigator@desk.noir', '$2a$10$iWbH8P3vI67fR3p7J9V4w.m7a5Kx2fC.B9u8N2kL0P4rQ6tS8uVea', 85)
ON DUPLICATE KEY UPDATE score = VALUES(score);

