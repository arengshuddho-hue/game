const { createToken, setAuthCookie } = require('./lib/auth');
const { findUserByIdentity, createUser } = require('./lib/db');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  try {
    let demoUser = await findUserByIdentity('detective');
    if (!demoUser) {
      const salt = bcrypt.genSaltSync(10);
      demoUser = await createUser('detective', 'detective@desk.noir', bcrypt.hashSync('sherlock123', salt));
    }

    const token = createToken(demoUser);
    setAuthCookie(res, token);

    // If accessed via link/browser GET, redirect straight to game.html
    const acceptHeader = req.headers.accept || '';
    if (acceptHeader.includes('text/html') || req.method === 'GET') {
      res.writeHead(302, { Location: '/game.html' });
      return res.end();
    }

    return res.status(200).json({
      success: true,
      user: {
        id: demoUser.id,
        username: demoUser.username,
        email: demoUser.email,
        score: demoUser.score || 0
      },
      token
    });
  } catch (err) {
    console.error('Demo login error:', err);
    return res.status(500).json({ success: false, error: 'Could not create demo session' });
  }
};

