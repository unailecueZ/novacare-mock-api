const { patients } = require('../lib/data');

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

module.exports = (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error_code: 'METHOD_NOT_ALLOWED',
      message: 'Only POST requests are allowed'
    });
  }

  const { patient_id, date_of_birth } = req.body;

  if (!patient_id || !date_of_birth) {
    return res.status(400).json({
      success: false,
      error_code: 'MISSING_PARAMETERS',
      message: 'Both patient_id and date_of_birth are required'
    });
  }

  const patient = patients.find(p => p.id === patient_id);

  if (!patient) {
    return res.status(404).json({
      success: false,
      error_code: 'PATIENT_NOT_FOUND',
      message: 'No patient found with the provided ID'
    });
  }

  if (patient.dateOfBirth !== date_of_birth) {
    return res.status(401).json({
      success: false,
      error_code: 'VERIFICATION_FAILED',
      message: 'Date of birth does not match our records'
    });
  }

  return res.status(200).json({
    success: true,
    verified: true,
    patient: {
      id: patient.id,
      name: patient.name
    }
  });
};
