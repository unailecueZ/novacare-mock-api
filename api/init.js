const { initializeData } = require('../lib/kv-helper');

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

module.exports = async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error_code: 'METHOD_NOT_ALLOWED',
      message: 'Only GET and POST requests are allowed'
    });
  }

  try {
    const result = await initializeData();
    return res.status(200).json({
      success: true,
      message: 'Database reset to initial state',
      details: {
        patients: 3,
        appointments: 6,
        available_slots: 10
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error_code: 'INITIALIZATION_FAILED',
      message: 'Failed to initialize data',
      error: error.message
    });
  }
};
