const bcrypt = require('bcryptjs');
const { findUserByIdentity } = require('./lib/db');
const { createToken, setAuthCookie } = require('./lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params);
      }
    } else if (!body) {
      body = {};
    }

    const identity = (body.identity || '').trim();
    const password = body.password || '';

    if (!identity || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing identity or password',
        errorKey: 'err_login'
      });
    }

    const user = await findUserByIdentity(identity);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        errorKey: 'err_login'
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        errorKey: 'err_login'
      });
    }

    const token = createToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        score: user.score || 0
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      errorKey: 'err_login'
    });
  }
};

