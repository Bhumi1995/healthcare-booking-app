

"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("patient")
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const navigate = useNavigate()
  const { login } = useAuth()

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (password) => password.length >= 6


  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    if (!value.trim()) {
      setEmailError("Email is required")
    } else if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    if (!value.trim()) {
      setPasswordError("Password is required")
    } else if (!validatePassword(value)) {
     setPasswordError("Password must be at least 6 characters")
    } else {
      setPasswordError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (emailError || passwordError || !email || !password) {
      setError("Please fill the all fields correctly.")
      return
    }

    try {
      await login(email.trim(), password, userType)
      navigate(userType === "doctor" ? "/doctor" : "/patient")
    } catch (error) {
      setError(error.message || "Failed to log in. Please check your credentials.")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              // className={emailError ? "field-error" : ""}
              required
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              // className={passwordError ? "field-error" : ""}
              required
            />
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>

          <div className="form-group">
            <label>I am a:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="patient"
                  checked={userType === "patient"}
                  onChange={() => setUserType("patient")}
                />
                Patient
              </label>
              <label>
                <input
                  type="radio"
                  value="doctor"
                  checked={userType === "doctor"}
                  onChange={() => setUserType("doctor")}
                />
                Doctor
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  )
}

export default Login

