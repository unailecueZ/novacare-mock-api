const { getPatients } = require('../../lib/kv-helper');

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

  if (req.method === 'GET') {
    const patients = await getPatients();

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients: patients.map(p => ({
        id: p.id,
        name: p.name,
        date_of_birth: p.dateOfBirth,
        email: p.email,
        phone: p.phone
      }))
    });
  }

  if (req.method === 'POST') {
    const { name, date_of_birth, email, phone } = req.body;

    if (!name || !date_of_birth) {
      return res.status(400).json({
        success: false,
        error_code: 'MISSING_PARAMETERS',
        message: 'name and date_of_birth are required'
      });
    }

    const patients = await getPatients();
    const newPatientId = `PAT-${String(patients.length + 1).padStart(3, '0')}`;

    const newPatient = {
      id: newPatientId,
      name: name,
      dateOfBirth: date_of_birth,
      email: email || null,
      phone: phone || null,
      created_at: new Date().toISOString()
    };

    patients.push(newPatient);
    const { kv } = require('@vercel/kv');
    await kv.set('novacare:patients', patients);

    return res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      patient: {
        id: newPatient.id,
        name: newPatient.name,
        date_of_birth: newPatient.dateOfBirth,
        email: newPatient.email,
        phone: newPatient.phone,
        created_at: newPatient.created_at
      }
    });
  }

  return res.status(405).json({
    success: false,
    error_code: 'METHOD_NOT_ALLOWED',
    message: 'Only GET and POST requests are allowed'
  });
};
