"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { useAuth } from "./AuthContext"

// Create context
const AppointmentContext = createContext()

// Custom hook to use appointment context
export const useAppointments = () => useContext(AppointmentContext)

export const AppointmentProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  // Load appointments from localStorage on initial load
  useEffect(() => {
    const storedAppointments = localStorage.getItem("appointments")
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments))
    }

    // Mock doctors data
    setDoctors([
      { id: 1, name: "Dr. John Smith", specialty: "Cardiology" },
      { id: 2, name: "Dr. Sarah Johnson", specialty: "Dermatology" },
      { id: 3, name: "Dr. Michael Brown", specialty: "Neurology" },
      { id: 4, name: "Dr. Emily Davis", specialty: "Pediatrics" },
      { id: 5, name: "Dr. Robert Wilson", specialty: "Orthopedics" },
    ])

    setLoading(false)
  }, [])

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("appointments", JSON.stringify(appointments))
    }
  }, [appointments, loading])

  // Book a new appointment
  const bookAppointment = (appointmentData) => {
    const newAppointment = {
      id: Date.now(),
      ...appointmentData,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    setAppointments([...appointments, newAppointment])
    return newAppointment
  }

  // Update appointment status (for doctors)
  const updateAppointmentStatus = (appointmentId, status) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === appointmentId ? { ...appointment, status, updatedAt: new Date().toISOString() } : appointment,
    )

    setAppointments(updatedAppointments)
  }

  // Cancel appointment (for patients)
  const cancelAppointment = (appointmentId) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === appointmentId
        ? { ...appointment, status: "cancelled", updatedAt: new Date().toISOString() }
        : appointment,
    )

    setAppointments(updatedAppointments)
  }

  // Get appointments for the current user
  const getUserAppointments = () => {
    if (!currentUser) return []

    if (currentUser.userType === "patient") {
      return appointments.filter((appointment) => appointment.patientId === currentUser.id)
    } else if (currentUser.userType === "doctor") {
      return appointments.filter((appointment) => appointment.doctorId === currentUser.id)
    }

    return []
  }

  const value = {
    appointments,
    doctors,
    bookAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    getUserAppointments,
  }

  return <AppointmentContext.Provider value={value}>{!loading && children}</AppointmentContext.Provider>
}
