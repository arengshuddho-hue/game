const bcrypt = require('bcryptjs');
const { findUserByIdentity, createUser } = require('./lib/db');
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

    const username = (body.username || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    // Validation
    const usernameRegex = /^[A-Za-z0-9_]{3,30}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        success: false,
        error: 'Username must be 3-30 letters, numbers or underscore',
        errorKey: 'err_username'
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address',
        errorKey: 'err_email'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
        errorKey: 'err_password'
      });
    }

    // Check if user or email already exists
    const existing = await findUserByIdentity(username);
    const existingEmail = await findUserByIdentity(email);

    if (existing || existingEmail) {
      return res.status(409).json({
        success: false,
        error: 'Username or email is already taken',
        errorKey: 'err_taken'
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = await createUser(username, email, passwordHash);
    const token = createToken(newUser);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        score: 0
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      errorKey: 'err_server'
    });
  }
};

