const { kv } = require('@vercel/kv');
const { patients: initialPatients, appointments: initialAppointments, availableSlots: initialSlots } = require('./data');

const KEYS = {
  PATIENTS: 'novacare:patients',
  APPOINTMENTS: 'novacare:appointments',
  SLOTS: 'novacare:slots',
  INITIALIZED: 'novacare:initialized'
};

async function initializeData() {
  await kv.set(KEYS.PATIENTS, initialPatients);
  await kv.set(KEYS.APPOINTMENTS, initialAppointments);
  await kv.set(KEYS.SLOTS, initialSlots);
  await kv.set(KEYS.INITIALIZED, true);
  return { success: true, message: 'Data initialized successfully' };
}

async function ensureInitialized() {
  const isInitialized = await kv.get(KEYS.INITIALIZED);
  if (!isInitialized) {
    await initializeData();
  }
}

async function getPatients() {
  await ensureInitialized();
  return await kv.get(KEYS.PATIENTS) || [];
}

async function getAppointments() {
  await ensureInitialized();
  return await kv.get(KEYS.APPOINTMENTS) || [];
}

async function getSlots() {
  await ensureInitialized();
  return await kv.get(KEYS.SLOTS) || [];
}

async function setAppointments(appointments) {
  return await kv.set(KEYS.APPOINTMENTS, appointments);
}

async function setSlots(slots) {
  return await kv.set(KEYS.SLOTS, slots);
}

async function addAppointment(appointment) {
  const appointments = await getAppointments();
  appointments.push(appointment);
  await setAppointments(appointments);
  return appointment;
}

async function updateAppointment(appointmentId, updates) {
  const appointments = await getAppointments();
  const index = appointments.findIndex(apt => apt.appointmentId === appointmentId);
  if (index === -1) return null;

  appointments[index] = { ...appointments[index], ...updates };
  await setAppointments(appointments);
  return appointments[index];
}

async function removeSlot(slotId) {
  const slots = await getSlots();
  const filtered = slots.filter(s => s.slotId !== slotId);
  await setSlots(filtered);
}

module.exports = {
  KEYS,
  initializeData,
  ensureInitialized,
  getPatients,
  getAppointments,
  getSlots,
  setAppointments,
  setSlots,
  addAppointment,
  updateAppointment,
  removeSlot
};
