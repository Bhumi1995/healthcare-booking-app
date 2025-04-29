"use client"

import { useState } from "react"
import { useAppointments } from "../../context/AppointmentContext"
import { useAuth } from "../../context/AuthContext"

const ManageAppointments = () => {
  const { getUserAppointments, updateAppointmentStatus } = useAppointments()
  const { currentUser } = useAuth()
  const [filter, setFilter] = useState("all")

  const userAppointments = getUserAppointments()

  // Filter appointments based on selected filter
  const filteredAppointments = userAppointments.filter((appointment) => {
    if (filter === "all") return true
    if (filter === "upcoming") {
      return (
        new Date(appointment.date) > new Date() &&
        (appointment.status === "confirmed" || appointment.status === "pending")
      )
    }
    if (filter === "past") {
      return new Date(appointment.date) < new Date() || appointment.status === "cancelled"
    }
    return appointment.status === filter
  })

  // Sort appointments by date (newest first)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => new Date(b.date) - new Date(a.date))

  const handleStatusUpdate = (appointmentId, status) => {
    updateAppointmentStatus(appointmentId, status)
  }

  // Helper function to get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed"
      case "pending":
        return "status-pending"
      case "cancelled":
        return "status-cancelled"
      case "completed":
        return "status-completed"
      default:
        return ""
    }
  }

  return (
    <div className="manage-appointments">
      <h2>Manage Appointments</h2>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Filter by:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Appointments</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {sortedAppointments.length === 0 ? (
        <div className="empty-state">
          <p>No appointments found.</p>
        </div>
      ) : (
        <div className="appointments-list">
          {sortedAppointments.map((appointment) => {
            const isPast = new Date(appointment.date) < new Date()
            const canUpdate = !isPast && appointment.status !== "cancelled"

            return (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-patient">
                    <h4>{appointment.patientName || "Patient"}</h4>
                  </div>
                  <div className={`appointment-status ${getStatusClass(appointment.status)}`}>{appointment.status}</div>
                </div>

                <div className="appointment-details">
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{appointment.time}</span>
                  </div>
                  {appointment.reason && (
                    <div className="detail-item">
                      <span className="detail-label">Reason:</span>
                      <span className="detail-value">{appointment.reason}</span>
                    </div>
                  )}
                </div>

                {canUpdate && (
                  <div className="appointment-actions">
                    {appointment.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
                          className="btn btn-success btn-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                          className="btn btn-danger btn-sm"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <button
                        onClick={() => handleStatusUpdate(appointment.id, "completed")}
                        className="btn btn-primary btn-sm"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ManageAppointments
