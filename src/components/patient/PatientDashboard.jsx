"use client";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppointments } from "../../context/AppointmentContext";

const PatientDashboard = () => {
  const { currentUser } = useAuth();
  const { getUserAppointments, doctors } = useAppointments();
  const [showAllDoctors, setShowAllDoctors] = useState(false);

  // Fallback to email if name doesn't exist
  const displayName =
    currentUser?.name || currentUser?.email?.split("@")[0] || "Patient";

  const userAppointments = getUserAppointments();
  const upcomingAppointments = userAppointments
    .filter(
      (app) => app.status === "confirmed" && new Date(app.date) > new Date()
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="dashboard">
      <h2>Patient Dashboard</h2>

      <div className="dashboard-welcome">
        <h3>Welcome back, {displayName}!</h3>
        <p>Manage your appointments and health information all in one place.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h4>Upcoming Appointments</h4>
          {upcomingAppointments.length > 0 ? (
            <ul className="appointment-list">
              {upcomingAppointments.map((appointment) => {
                const doctor = doctors.find(
                  (d) => d.id === appointment.doctorId
                );
                return (
                  <li key={appointment.id} className="appointment-item">
                    <div className="appointment-date">
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                    <div className="appointment-time">{appointment.time}</div>
                    <div className="appointment-doctor">{doctor?.name}</div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No upcoming appointments.</p>
          )}
          <Link to="/patient/appointments" className="btn btn-sm">
            View All
          </Link>
        </div>

        <div className="dashboard-card">
          <h4>Quick Actions</h4>
          <div className="action-buttons">
            <Link to="/patient/book" className="btn">
              Book New Appointment
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h4>Available Doctors</h4>
          <div className={`doctor-list-container ${showAllDoctors ? "expanded" : ""}`}>
          <ul className="doctor-list">
            {(showAllDoctors ? doctors : doctors.slice(0, 3)).map((doctor) => (
              <li key={doctor.id} className="doctor-item">
                <div className="doctor-name">{doctor.name}</div>
                <div className="doctor-specialty">{doctor.specialty}</div>
              </li>
            ))}
          </ul>
          </div>
          <Link
            onClick={() => setShowAllDoctors((prev) => !prev)}
            className="btn btn-sm"
          >
            {showAllDoctors ? "Show Less" : "See All Doctors"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
