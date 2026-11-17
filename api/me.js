const { getUserFromReq } = require('./lib/auth');
const { findUserById } = require('./lib/db');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const authUser = getUserFromReq(req);
    if (!authUser) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        error: 'Not authenticated'
      });
    }

    const user = await findUserById(authUser.uid);
    if (!user) {
      return res.status(404).json({
        success: false,
        authenticated: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        score: user.score || 0
      }
    });
  } catch (err) {
    console.error('Auth check error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

