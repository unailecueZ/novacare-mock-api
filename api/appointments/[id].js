const { appointments, availableSlots } = require('../../lib/data');

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

  if (req.method !== 'PUT') {
    return res.status(405).json({
      success: false,
      error_code: 'METHOD_NOT_ALLOWED',
      message: 'Only PUT requests are allowed'
    });
  }

  const { id } = req.query;

  if (id === 'APT-999') {
    return res.status(503).json({
      success: false,
      error_code: 'EHR_UNAVAILABLE',
      message: 'Epic EHR system is temporarily unavailable. Please try again later.'
    });
  }

  const appointment = appointments.find(apt => apt.appointmentId === id);

  if (!appointment) {
    return res.status(404).json({
      success: false,
      error_code: 'APPOINTMENT_NOT_FOUND',
      message: 'No appointment found with the provided ID'
    });
  }

  const { slot_id, new_date, new_time, reason } = req.body;

  if (!slot_id && !new_date && !new_time) {
    return res.status(400).json({
      success: false,
      error_code: 'MISSING_PARAMETERS',
      message: 'At least one of slot_id, new_date, or new_time is required'
    });
  }

  let updatedDate = appointment.date;
  let updatedTime = appointment.time;
  let updatedProvider = appointment.provider;
  let updatedLocation = appointment.location;

  if (slot_id) {
    const slot = availableSlots.find(s => s.slotId === slot_id);
    if (!slot) {
      return res.status(400).json({
        success: false,
        error_code: 'INVALID_SLOT',
        message: 'The provided slot_id does not exist or is no longer available'
      });
    }
    updatedDate = slot.date;
    updatedTime = slot.time;
    updatedProvider = slot.provider;
    updatedLocation = slot.location;
  } else {
    if (new_date) updatedDate = new_date;
    if (new_time) updatedTime = new_time;
  }

  const confirmationNumber = `CONF-${Date.now().toString().slice(-8)}`;

  return res.status(200).json({
    success: true,
    confirmation_number: confirmationNumber,
    updated_appointment: {
      appointment_id: appointment.appointmentId,
      patient_id: appointment.patientId,
      previous_date: appointment.date,
      previous_time: appointment.time,
      new_date: updatedDate,
      new_time: updatedTime,
      provider: updatedProvider,
      type: appointment.type,
      location: updatedLocation,
      status: 'rescheduled',
      reason: reason || null
    },
    message: 'Appointment successfully rescheduled'
  });
};
