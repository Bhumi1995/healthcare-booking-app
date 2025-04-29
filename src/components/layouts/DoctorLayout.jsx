"use client"
import { Outlet, Navigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const DoctorLayout = () => {
  const { currentUser, isDoctor, logout } = useAuth()

  // Redirect if not logged in or not a doctor
  if (!currentUser || !isDoctor) {
    return <Navigate to="/login" />
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <h1>MediBook</h1>
        </div>
        <div className="user-info">
          <span>Welcome, Dr. {currentUser.name}</span>
          <button onClick={logout} className="btn btn-sm">
            Logout
          </button>
        </div>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <nav>
            <ul>
              <li>
                <Link to="/doctor">Dashboard</Link>
              </li>
              <li>
                <Link to="/doctor/appointments">Manage Appointments</Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DoctorLayout
