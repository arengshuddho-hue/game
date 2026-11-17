const { clearAuthCookie } = require('./lib/auth');

module.exports = async function handler(req, res) {
  clearAuthCookie(res);

  // If request is from browser navigation (e.g. GET /logout.php or GET /api/logout), redirect
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('text/html') || req.method === 'GET') {
    res.writeHead(302, { Location: '/login.html' });
    return res.end();
  }

  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

