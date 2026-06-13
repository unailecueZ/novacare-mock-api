const { getPatients } = require('../../lib/kv-helper');

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      error_code: 'MISSING_PARAMETER',
      message: 'Email parameter is required'
    });
  }

  const patients = await getPatients();
  const patient = patients.find(p => p.email && p.email.toLowerCase() === email.toLowerCase());

  if (!patient) {
    return res.status(200).json({
      success: false,
      message: 'User not found',
      patient: null
    });
  }

  return res.status(200).json({
    success: true,
    patient: {
      id: patient.id,
      name: patient.name,
      date_of_birth: patient.dateOfBirth,
      email: patient.email,
      phone: patient.phone
    }
  });
};
