const { getSlots } = require('../../lib/kv-helper');

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

module.exports = async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error_code: 'METHOD_NOT_ALLOWED',
      message: 'Only GET requests are allowed'
    });
  }

  const { from, to, provider } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      success: false,
      error_code: 'MISSING_PARAMETERS',
      message: 'Both from and to date parameters are required (format: YYYY-MM-DD)'
    });
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    return res.status(400).json({
      success: false,
      error_code: 'INVALID_DATE_FORMAT',
      message: 'Invalid date format. Please use YYYY-MM-DD'
    });
  }

  const availableSlots = await getSlots();
  let filteredSlots = availableSlots.filter(slot => {
    const slotDate = new Date(slot.date);
    return slotDate >= fromDate && slotDate <= toDate;
  });

  if (provider) {
    filteredSlots = filteredSlots.filter(slot =>
      slot.provider.toLowerCase().includes(provider.toLowerCase())
    );
  }

  return res.status(200).json({
    success: true,
    filters: {
      from,
      to,
      provider: provider || null
    },
    count: filteredSlots.length,
    slots: filteredSlots.map(slot => ({
      slot_id: slot.slotId,
      date: slot.date,
      time: slot.time,
      provider: slot.provider,
      duration_minutes: slot.duration,
      location: slot.location
    }))
  });
};
