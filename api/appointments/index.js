const { appointments, patients, availableSlots } = require('../../lib/data');

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

module.exports = (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= today;
    });

    return res.status(200).json({
      success: true,
      count: upcomingAppointments.length,
      appointments: upcomingAppointments.map(apt => ({
        appointment_id: apt.appointmentId,
        patient_id: apt.patientId,
        date: apt.date,
        time: apt.time,
        provider: apt.provider,
        type: apt.type,
        location: apt.location,
        status: apt.status
      }))
    });
  }

  if (req.method === 'POST') {
    const { patient_id, slot_id, appointment_type, notes } = req.body;

    if (!patient_id || !slot_id || !appointment_type) {
      return res.status(400).json({
        success: false,
        error_code: 'MISSING_PARAMETERS',
        message: 'patient_id, slot_id, and appointment_type are required'
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

    const slot = availableSlots.find(s => s.slotId === slot_id);
    if (!slot) {
      return res.status(404).json({
        success: false,
        error_code: 'SLOT_NOT_FOUND',
        message: 'The provided slot_id does not exist or is no longer available'
      });
    }

    const newAppointmentId = `APT-${Math.floor(Math.random() * 9000) + 1000}`;

    const newAppointment = {
      appointment_id: newAppointmentId,
      patient_id: patient_id,
      patient_name: patient.name,
      date: slot.date,
      time: slot.time,
      provider: slot.provider,
      type: appointment_type,
      location: slot.location,
      status: 'confirmed',
      notes: notes || null,
      created_at: new Date().toISOString()
    };

    return res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment: newAppointment
    });
  }

  return res.status(405).json({
    success: false,
    error_code: 'METHOD_NOT_ALLOWED',
    message: 'Only GET and POST requests are allowed'
  });
};
