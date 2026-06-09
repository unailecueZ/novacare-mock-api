const { getPatients, getAppointments } = require('../../../lib/kv-helper');

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

  const { id } = req.query;

  const patients = await getPatients();
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return res.status(404).json({
      success: false,
      error_code: 'PATIENT_NOT_FOUND',
      message: 'No patient found with the provided ID'
    });
  }

  const appointments = await getAppointments();
  const patientAppointments = appointments.filter(apt => apt.patientId === id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = patientAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= today;
  });

  return res.status(200).json({
    success: true,
    patient: {
      id: patient.id,
      name: patient.name
    },
    appointments: upcomingAppointments.map(apt => ({
      appointment_id: apt.appointmentId,
      date: apt.date,
      time: apt.time,
      provider: apt.provider,
      type: apt.type,
      location: apt.location,
      status: apt.status
    }))
  });
};
