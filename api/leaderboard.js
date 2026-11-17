const { getLeaderboard } = require('./lib/db');

module.exports = async function handler(req, res) {
  try {
    const limit = parseInt(req.query?.limit || '10');
    const leaders = await getLeaderboard(limit);
    return res.status(200).json({ success: true, leaderboard: leaders });
  } catch (err) {
    console.error('Leaderboard error:', err);
    return res.status(500).json({ success: false, error: 'Could not fetch leaderboard' });
  }
};

