"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useAppointments } from "../../context/AppointmentContext"

const DoctorDashboard = () => {
  const { currentUser } = useAuth()
  const { getUserAppointments } = useAppointments()

  const userAppointments = getUserAppointments()

  // Get today's appointments
  const today = new Date().toISOString().split("T")[0]
  const todayAppointments = userAppointments
    .filter((app) => app.date === today && app.status === "confirmed")
    .sort((a, b) => {
      // Sort by time
      const timeA = new Date(`1970/01/01 ${a.time}`)
      const timeB = new Date(`1970/01/01 ${b.time}`)
      return timeA - timeB
    })

  // Get pending appointments
  const pendingAppointments = userAppointments.filter((app) => app.status === "pending").length

  // Get upcoming appointments (excluding today)
  const upcomingAppointments = userAppointments.filter(
    (app) => new Date(app.date) > new Date() && app.date !== today && app.status === "confirmed",
  ).length

  return (
    <div className="dashboard">
      <h2>Doctor Dashboard</h2>

      <div className="dashboard-welcome">
        <h3>Welcome, Dr. {currentUser.name}!</h3>
        <p>Manage your appointments and patient schedule all in one place.</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Today's Appointments</h4>
          <div className="stat-value">{todayAppointments.length}</div>
        </div>

        <div className="stat-card">
          <h4>Pending Requests</h4>
          <div className="stat-value">{pendingAppointments}</div>
        </div>

        <div className="stat-card">
          <h4>Upcoming Appointments</h4>
          <div className="stat-value">{upcomingAppointments}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h4>Today's Schedule</h4>
          {todayAppointments.length > 0 ? (
            <ul className="appointment-list">
              {todayAppointments.map((appointment) => (
                <li key={appointment.id} className="appointment-item">
                  <div className="appointment-time">{appointment.time}</div>
                  <div className="appointment-patient">{appointment.patientName || "Patient"}</div>
                  <div className="appointment-reason">{appointment.reason || "General Checkup"}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointments scheduled for today.</p>
          )}
        </div>

        <div className="dashboard-card">
          <h4>Quick Actions</h4>
          <div className="action-buttons">
            <Link to="/doctor/appointments" className="btn">
              Manage Appointments
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
