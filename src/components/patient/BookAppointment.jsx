"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useAppointments } from "../../context/AppointmentContext"

const BookAppointment = () => {
  const { currentUser } = useAuth()
  const { doctors, bookAppointment } = useAppointments()
  const navigate = useNavigate()

  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  // Generate available time slots
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!selectedDoctor || !date || !time) {
      return setError("Please fill in all required fields")
    }

    try {
      const doctorId = Number.parseInt(selectedDoctor)

      bookAppointment({
        patientId: currentUser.id,
        doctorId,
        date,
        time,
        reason,
      })

      navigate("/patient/appointments")
    } catch (error) {
      setError("Failed to book appointment. Please try again.")
    }
  }

  // Calculate minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="book-appointment">
      <h2>Book an Appointment</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label>Select Doctor</label>
          <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
            <option value="">-- Select a Doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialty}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} required />
        </div>

        <div className="form-group">
          <label>Time</label>
          <select value={time} onChange={(e) => setTime(e.target.value)} required>
            <option value="">-- Select a Time --</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Reason for Visit</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} />
        </div>

        <button type="submit" className="btn btn-primary">
          Book Appointment
        </button>
      </form>
    </div>
  )
}

export default BookAppointment
