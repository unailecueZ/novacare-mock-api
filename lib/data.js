const patients = [
  {
    id: 'PAT-001',
    name: 'Jane Smith',
    dateOfBirth: '1985-03-15',
    email: 'jane.smith@email.com',
    phone: '555-0101'
  },
  {
    id: 'PAT-002',
    name: 'Robert Johnson',
    dateOfBirth: '1972-08-22',
    email: 'robert.johnson@email.com',
    phone: '555-0102'
  },
  {
    id: 'PAT-003',
    name: 'Maria Garcia',
    dateOfBirth: '1990-11-05',
    email: 'maria.garcia@email.com',
    phone: '555-0103'
  }
];

const appointments = [
  {
    appointmentId: 'APT-101',
    patientId: 'PAT-001',
    date: '2026-06-15',
    time: '10:00 AM',
    provider: 'Dr. Sarah Chen',
    type: 'Annual Physical',
    location: 'NovaCare Main Campus - Building A, Room 205',
    status: 'confirmed'
  },
  {
    appointmentId: 'APT-102',
    patientId: 'PAT-001',
    date: '2026-06-22',
    time: '02:30 PM',
    provider: 'Dr. Michael Torres',
    type: 'Follow-up',
    location: 'NovaCare West Clinic - Suite 300',
    status: 'confirmed'
  },
  {
    appointmentId: 'APT-201',
    patientId: 'PAT-002',
    date: '2026-06-10',
    time: '09:00 AM',
    provider: 'Dr. Emily Parker',
    type: 'Cardiology Consultation',
    location: 'NovaCare Heart Center - 2nd Floor',
    status: 'confirmed'
  },
  {
    appointmentId: 'APT-202',
    patientId: 'PAT-002',
    date: '2026-06-18',
    time: '11:30 AM',
    provider: 'Dr. Sarah Chen',
    type: 'Lab Work',
    location: 'NovaCare Main Campus - Laboratory',
    status: 'confirmed'
  },
  {
    appointmentId: 'APT-203',
    patientId: 'PAT-002',
    date: '2026-06-25',
    time: '03:00 PM',
    provider: 'Dr. Emily Parker',
    type: 'Follow-up',
    location: 'NovaCare Heart Center - 2nd Floor',
    status: 'confirmed'
  },
  {
    appointmentId: 'APT-301',
    patientId: 'PAT-003',
    date: '2026-06-12',
    time: '01:00 PM',
    provider: 'Dr. James Rodriguez',
    type: 'Prenatal Checkup',
    location: 'NovaCare Women\'s Health - Suite 400',
    status: 'confirmed'
  }
];

const availableSlots = [
  {
    slotId: 'SLOT-001',
    date: '2026-06-08',
    time: '09:00 AM',
    provider: 'Dr. Sarah Chen',
    duration: 30,
    location: 'NovaCare Main Campus - Building A, Room 205'
  },
  {
    slotId: 'SLOT-002',
    date: '2026-06-08',
    time: '02:00 PM',
    provider: 'Dr. Michael Torres',
    duration: 30,
    location: 'NovaCare West Clinic - Suite 300'
  },
  {
    slotId: 'SLOT-003',
    date: '2026-06-09',
    time: '10:30 AM',
    provider: 'Dr. Emily Parker',
    duration: 45,
    location: 'NovaCare Heart Center - 2nd Floor'
  },
  {
    slotId: 'SLOT-004',
    date: '2026-06-11',
    time: '08:30 AM',
    provider: 'Dr. Sarah Chen',
    duration: 30,
    location: 'NovaCare Main Campus - Building A, Room 205'
  },
  {
    slotId: 'SLOT-005',
    date: '2026-06-13',
    time: '01:30 PM',
    provider: 'Dr. James Rodriguez',
    duration: 30,
    location: 'NovaCare Women\'s Health - Suite 400'
  },
  {
    slotId: 'SLOT-006',
    date: '2026-06-14',
    time: '11:00 AM',
    provider: 'Dr. Michael Torres',
    duration: 30,
    location: 'NovaCare West Clinic - Suite 300'
  },
  {
    slotId: 'SLOT-007',
    date: '2026-06-16',
    time: '03:30 PM',
    provider: 'Dr. Emily Parker',
    duration: 45,
    location: 'NovaCare Heart Center - 2nd Floor'
  },
  {
    slotId: 'SLOT-008',
    date: '2026-06-17',
    time: '09:30 AM',
    provider: 'Dr. Sarah Chen',
    duration: 30,
    location: 'NovaCare Main Campus - Building A, Room 205'
  },
  {
    slotId: 'SLOT-009',
    date: '2026-06-19',
    time: '10:00 AM',
    provider: 'Dr. James Rodriguez',
    duration: 30,
    location: 'NovaCare Women\'s Health - Suite 400'
  },
  {
    slotId: 'SLOT-010',
    date: '2026-06-20',
    time: '02:30 PM',
    provider: 'Dr. Michael Torres',
    duration: 30,
    location: 'NovaCare West Clinic - Suite 300'
  }
];

module.exports = {
  patients,
  appointments,
  availableSlots
};
