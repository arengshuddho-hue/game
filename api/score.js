const { getUserFromReq } = require('./lib/auth');
const { recordCaseResult, updateUserScore } = require('./lib/db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const authUser = getUserFromReq(req);
    if (!authUser) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    } else if (!body) {
      body = {};
    }

    const caseNumber = parseInt(body.caseNumber || '1');
    const score = parseInt(body.score || '0');
    const culprit = (body.culprit || '').trim();
    const motive = (body.motive || '').trim();

    await recordCaseResult(authUser.uid, caseNumber, score, culprit, motive);

    return res.status(200).json({
      success: true,
      message: 'Score saved to investigation records',
      score
    });
  } catch (err) {
    console.error('Score saving error:', err);
    return res.status(500).json({ success: false, error: 'Could not record score' });
  }
};

