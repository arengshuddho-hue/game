const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const JWT_SECRET = process.env.JWT_SECRET || 'the-detectives-desk-secret-key-noir-1940';
const COOKIE_NAME = 'detective_token';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

function createToken(user) {
  return jwt.sign(
    {
      uid: user.id,
      name: user.username,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function getTokenFromReq(req) {
  // Check Authorization header first: Bearer <token>
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Check Cookies
  if (req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    if (cookies[COOKIE_NAME]) {
      return cookies[COOKIE_NAME];
    }
  }

  return null;
}

function getUserFromReq(req) {
  const token = getTokenFromReq(req);
  if (!token) return null;
  return verifyToken(token);
}

function setAuthCookie(res, token) {
  const cookieStr = cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/'
  });

  // Support both Node HTTP and Express/Vercel res.setHeader
  const existing = res.getHeader ? res.getHeader('Set-Cookie') : undefined;
  if (existing) {
    if (Array.isArray(existing)) {
      res.setHeader('Set-Cookie', [...existing, cookieStr]);
    } else {
      res.setHeader('Set-Cookie', [existing, cookieStr]);
    }
  } else {
    res.setHeader('Set-Cookie', cookieStr);
  }
}

function clearAuthCookie(res) {
  const cookieStr = cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/'
  });
  res.setHeader('Set-Cookie', cookieStr);
}

module.exports = {
  createToken,
  verifyToken,
  getTokenFromReq,
  getUserFromReq,
  setAuthCookie,
  clearAuthCookie,
  COOKIE_NAME
};

