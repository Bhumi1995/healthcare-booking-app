"use client"
import { createContext, useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Initialize with demo data
  useEffect(() => {
    const initializeAuth = () => {
      if (!localStorage.getItem("users")) {
        const demoUsers = [
          {
            id: 1,
            name: "Test Patient",
            email: "patient@test.com",
            password: "patient123",
            userType: "patient",
            createdAt: new Date().toISOString()
          }
        ]
        localStorage.setItem("users", JSON.stringify(demoUsers))
      }

      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          setCurrentUser(user)
          // Auto-redirect if user is already logged in
          // if (user.userType === "patient") {
          //   navigate("/patient")
          // } else {
          //   navigate("/doctor")
          // }
        } catch (error) {
          console.error("Failed to parse user data", error)}
          localStorage.removeItem("user")
      }
      setLoading(false)
    }

    initializeAuth()
  }, [navigate])

  const login = async (email, password, userType) => {
    try {
      const users = JSON.parse(localStorage.getItem("users")) || []
      console.log("All stored users:", users) // Debug log
      
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password &&
        u.userType === userType
      )
      
      if (!user) {
        throw new Error("Invalid credentials")
      }

      localStorage.setItem("user", JSON.stringify(user))
      setCurrentUser(user)
      
      // Redirect after successful login
      if (user.userType === "patient") {
        navigate("/patient")
      } else {
        navigate("/doctor")
      }
      
      return user
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = (name, email, password, userType = "patient") => {
    try {
      const users = JSON.parse(localStorage.getItem("users")) || []
      console.log("Current users before registration:", users) // Debug log

      if (users.some(user => user.email === email)) {
        throw new Error("Email already registered")
      }

      const newUser = {
        id: Date.now(),
        name,
        email: email.toLowerCase(),
        password,
        userType,
        createdAt: new Date().toISOString()
      }

      const updatedUsers = [...users, newUser]
      localStorage.setItem("users", JSON.stringify(updatedUsers))
      localStorage.setItem("user", JSON.stringify(newUser))
      setCurrentUser(newUser)
      
      console.log("Registration successful for:", email) // Debug log
      console.log("All users after registration:", updatedUsers) // Debug log
      return newUser
    } catch (error) {
      console.error("Registration error:", error) // Debug log
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isPatient: currentUser?.userType === "patient",
    isDoctor: currentUser?.userType === "doctor"
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}