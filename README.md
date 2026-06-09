# NovaCare Mock API

Mock REST API simulating an Epic EHR system for NovaCare Health. Built with Vercel serverless functions for use in Zendesk AI deployment exercises.

## Endpoints

### POST /api/verify-identity
Verify patient identity with ID and date of birth.

**Request Body:**
```json
{
  "patient_id": "PAT-001",
  "date_of_birth": "1985-03-15"
}
```

**Response (200):**
```json
{
  "success": true,
  "verified": true,
  "patient": {
    "id": "PAT-001",
    "name": "Jane Smith"
  }
}
```

### GET /api/patients/:id/appointments
Get upcoming appointments for a patient.

**Response (200):**
```json
{
  "success": true,
  "patient": {
    "id": "PAT-001",
    "name": "Jane Smith"
  },
  "appointments": [
    {
      "appointment_id": "APT-101",
      "date": "2026-06-15",
      "time": "10:00 AM",
      "provider": "Dr. Sarah Chen",
      "type": "Annual Physical",
      "location": "NovaCare Main Campus - Building A, Room 205",
      "status": "confirmed"
    }
  ]
}
```

### GET /api/appointments/available-slots
Get available appointment slots within a date range.

**Query Parameters:**
- `from` (required): Start date (YYYY-MM-DD)
- `to` (required): End date (YYYY-MM-DD)
- `provider` (optional): Filter by provider name

**Response (200):**
```json
{
  "success": true,
  "filters": {
    "from": "2026-06-08",
    "to": "2026-06-20",
    "provider": null
  },
  "count": 10,
  "slots": [
    {
      "slot_id": "SLOT-001",
      "date": "2026-06-08",
      "time": "09:00 AM",
      "provider": "Dr. Sarah Chen",
      "duration_minutes": 30,
      "location": "NovaCare Main Campus - Building A, Room 205"
    }
  ]
}
```

### GET /api/appointments
Get all upcoming appointments across all patients.

**Response (200):**
```json
{
  "success": true,
  "count": 6,
  "appointments": [
    {
      "appointment_id": "APT-101",
      "patient_id": "PAT-001",
      "date": "2026-06-15",
      "time": "10:00 AM",
      "provider": "Dr. Sarah Chen",
      "type": "Annual Physical",
      "location": "NovaCare Main Campus - Building A, Room 205",
      "status": "confirmed"
    }
  ]
}
```

### GET /api/appointments/:id
Get details of a specific appointment.

**Response (200):**
```json
{
  "success": true,
  "appointment": {
    "appointment_id": "APT-101",
    "patient_id": "PAT-001",
    "date": "2026-06-15",
    "time": "10:00 AM",
    "provider": "Dr. Sarah Chen",
    "type": "Annual Physical",
    "location": "NovaCare Main Campus - Building A, Room 205",
    "status": "confirmed"
  }
}
```

### POST /api/appointments
Create a new appointment.

**Request Body:**
```json
{
  "patient_id": "PAT-001",
  "slot_id": "SLOT-001",
  "appointment_type": "Annual Physical",
  "notes": "Patient requested morning slot"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Appointment created successfully",
  "appointment": {
    "appointment_id": "APT-4521",
    "patient_id": "PAT-001",
    "patient_name": "Jane Smith",
    "date": "2026-06-08",
    "time": "09:00 AM",
    "provider": "Dr. Sarah Chen",
    "type": "Annual Physical",
    "location": "NovaCare Main Campus - Building A, Room 205",
    "status": "confirmed",
    "notes": "Patient requested morning slot",
    "created_at": "2026-06-08T10:30:00.000Z"
  }
}
```

### PUT /api/appointments/:id
Reschedule an appointment.

**Request Body:**
```json
{
  "slot_id": "SLOT-001",
  "new_date": "2026-06-15",
  "new_time": "10:00 AM",
  "reason": "Schedule conflict"
}
```

**Response (200):**
```json
{
  "success": true,
  "confirmation_number": "CONF-12345678",
  "updated_appointment": {
    "appointment_id": "APT-101",
    "patient_id": "PAT-001",
    "previous_date": "2026-06-15",
    "previous_time": "10:00 AM",
    "new_date": "2026-06-08",
    "new_time": "09:00 AM",
    "provider": "Dr. Sarah Chen",
    "type": "Annual Physical",
    "location": "NovaCare Main Campus - Building A, Room 205",
    "status": "rescheduled",
    "reason": "Schedule conflict"
  },
  "message": "Appointment successfully rescheduled"
}
```

### DELETE /api/appointments/:id
Cancel an appointment (marks as cancelled, does not delete).

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "cancelled_appointment": {
    "appointment_id": "APT-101",
    "patient_id": "PAT-001",
    "date": "2026-06-15",
    "time": "10:00 AM",
    "provider": "Dr. Sarah Chen",
    "type": "Annual Physical",
    "status": "cancelled",
    "cancelled_at": "2026-06-08T10:30:00.000Z"
  }
}
```

**Special Test Case:**
- Using appointment ID `APT-999` will return a 503 error simulating EHR system unavailability

## Mock Data

### Patients
- **PAT-001**: Jane Smith (DOB: 1985-03-15) - 2 upcoming appointments
- **PAT-002**: Robert Johnson (DOB: 1972-08-22) - 3 upcoming appointments
- **PAT-003**: Maria Garcia (DOB: 1990-11-05) - 1 upcoming appointment

### Available Slots
10 available slots spread across June 8-20, 2026 with various providers and times.

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error_code": "ERROR_CODE_STRING",
  "message": "Human readable error message"
}
```

Common error codes:
- `MISSING_PARAMETERS` (400)
- `INVALID_DATE_FORMAT` (400)
- `VERIFICATION_FAILED` (401)
- `PATIENT_NOT_FOUND` (404)
- `APPOINTMENT_NOT_FOUND` (404)
- `METHOD_NOT_ALLOWED` (405)
- `EHR_UNAVAILABLE` (503)

## Deployment

Deploy to Vercel:
```bash
vercel
```

## CORS

All endpoints include CORS headers allowing cross-origin requests from any domain for use with Zendesk browser-based integrations.
