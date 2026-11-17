const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

let pool = null;
let dbInitialized = false;

// Fallback in-memory / temporary file store for seamless Vercel preview without DB setup
const FALLBACK_FILE = path.join(process.env.TEMP || process.env.TMPDIR || '/tmp', 'detective_users.json');

function loadFallbackStore() {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      const data = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
      if (data && Array.isArray(data.users)) return data;
    }
  } catch (e) {
    // ignore
  }

  // Pre-seeded demo accounts
  const salt = bcrypt.genSaltSync(10);
  return {
    users: [
      {
        id: 1,
        username: 'detective',
        email: 'detective@desk.noir',
        password_hash: bcrypt.hashSync('sherlock123', salt),
        score: 125,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        username: 'investigator',
        email: 'investigator@desk.noir',
        password_hash: bcrypt.hashSync('detective123', salt),
        score: 85,
        created_at: new Date().toISOString()
      }
    ],
    records: []
  };
}

let fallbackStore = loadFallbackStore();

function saveFallbackStore() {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(fallbackStore, null, 2), 'utf8');
  } catch (e) {
    // In-memory will still hold the state for the instance lifecycle
  }
}

// Parse connection URL if available
function getDbConfig() {
  const connUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;
  if (connUrl && (connUrl.startsWith('mysql://') || connUrl.startsWith('mysqls://'))) {
    try {
      const url = new URL(connUrl);
      const isSsl = url.searchParams.get('ssl') !== 'false' && (url.searchParams.has('ssl') || process.env.NODE_ENV === 'production');
      return {
        host: url.hostname,
        port: parseInt(url.port || '3306'),
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.replace(/^\//, ''),
        ssl: isSsl ? { rejectUnauthorized: false } : undefined,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0
      };
    } catch (e) {
      console.warn('Failed to parse MYSQL_URL / DATABASE_URL:', e.message);
    }
  }

  // Individual env vars
  if (process.env.MYSQL_HOST || process.env.DB_HOST) {
    const isSsl = process.env.MYSQL_SSL === 'true' || process.env.TIDB_ENABLE_SSL === 'true';
    return {
      host: process.env.MYSQL_HOST || process.env.DB_HOST,
      port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306'),
      user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
      password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'detective_desk',
      ssl: isSsl ? { rejectUnauthorized: false } : undefined,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    };
  }

  return null;
}

async function getPool() {
  if (pool) return pool;
  const config = getDbConfig();
  if (!config) return null;

  try {
    pool = mysql.createPool(config);
    // Test connection
    const conn = await pool.getConnection();
    conn.release();

    if (!dbInitialized) {
      await initTables(pool);
      dbInitialized = true;
    }
    return pool;
  } catch (err) {
    console.warn('Could not connect to external MySQL, falling back to instant secure storage:', err.message);
    pool = null;
    return null;
  }
}

async function initTables(p) {
  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        score INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS case_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        case_number INT NOT NULL,
        score INT NOT NULL,
        culprit VARCHAR(100),
        motive VARCHAR(100),
        solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } catch (e) {
    console.warn('Table initialization warning:', e.message);
  }
}

// User methods
async function findUserByIdentity(identity) {
  const p = await getPool();
  if (p) {
    const [rows] = await p.query(
      'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
      [identity, identity]
    );
    return rows[0] || null;
  }

  const query = identity.toLowerCase();
  return fallbackStore.users.find(
    u => u.username.toLowerCase() === query || u.email.toLowerCase() === query
  ) || null;
}

async function findUserById(id) {
  const p = await getPool();
  if (p) {
    const [rows] = await p.query('SELECT id, username, email, score, created_at FROM users WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  }

  const u = fallbackStore.users.find(x => x.id === parseInt(id));
  if (!u) return null;
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    score: u.score || 0,
    created_at: u.created_at
  };
}

async function createUser(username, email, passwordHash) {
  const p = await getPool();
  if (p) {
    const [result] = await p.query(
      'INSERT INTO users (username, email, password_hash, score) VALUES (?, ?, ?, 0)',
      [username, email, passwordHash]
    );
    return {
      id: result.insertId,
      username,
      email,
      score: 0
    };
  }

  const newId = fallbackStore.users.length ? Math.max(...fallbackStore.users.map(u => u.id)) + 1 : 1;
  const newUser = {
    id: newId,
    username,
    email,
    password_hash: passwordHash,
    score: 0,
    created_at: new Date().toISOString()
  };
  fallbackStore.users.push(newUser);
  saveFallbackStore();
  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    score: 0
  };
}

async function updateUserScore(userId, newScore) {
  const p = await getPool();
  if (p) {
    await p.query('UPDATE users SET score = GREATEST(score, ?) WHERE id = ?', [newScore, userId]);
    return;
  }

  const u = fallbackStore.users.find(x => x.id === parseInt(userId));
  if (u) {
    u.score = Math.max(u.score || 0, newScore);
    saveFallbackStore();
  }
}

async function recordCaseResult(userId, caseNumber, score, culprit, motive) {
  const p = await getPool();
  if (p) {
    await p.query(
      'INSERT INTO case_records (user_id, case_number, score, culprit, motive) VALUES (?, ?, ?, ?, ?)',
      [userId, caseNumber, score, culprit, motive]
    );
    await updateUserScore(userId, score);
    return;
  }

  fallbackStore.records.push({
    userId,
    caseNumber,
    score,
    culprit,
    motive,
    solved_at: new Date().toISOString()
  });
  updateUserScore(userId, score);
  saveFallbackStore();
}

async function getLeaderboard(limit = 10) {
  const p = await getPool();
  if (p) {
    const [rows] = await p.query(
      'SELECT id, username, score, created_at FROM users ORDER BY score DESC, id ASC LIMIT ?',
      [limit]
    );
    return rows;
  }

  return [...fallbackStore.users]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit)
    .map(u => ({
      id: u.id,
      username: u.username,
      score: u.score || 0,
      created_at: u.created_at
    }));
}

async function getDbStatus() {
  const p = await getPool();
  return {
    connected: Boolean(p),
    mode: p ? 'remote_mysql' : 'embedded_storage',
    usersCount: p ? undefined : fallbackStore.users.length
  };
}

module.exports = {
  findUserByIdentity,
  findUserById,
  createUser,
  updateUserScore,
  recordCaseResult,
  getLeaderboard,
  getDbStatus
};

