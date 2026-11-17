const { getDbStatus } = require('./lib/db');

module.exports = async function handler(req, res) {
  try {
    const status = await getDbStatus();
    return res.status(200).json({
      success: true,
      service: "The Detective's Desk API",
      status: 'operational',
      database: status,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

