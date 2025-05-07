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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePassword = (password) => {
    // At least 8 characters, at least one letter and one number
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return re.test(password)
  }

  const validateForm = () => {
    let isValid = true
    
    // Email validation
    if (!email) {
      setEmailError("Email is required")
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      isValid = false
    } else {
      setEmailError("")
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required")
      isValid = false
    } else if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters with at least one letter and one number")
      isValid = false
    } else {
      setPasswordError("")
    }

    return isValid
  }

const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await login(email.trim(), password, userType)
      navigate("/patient") // Redirect to dashboard after successful login
    } catch (error) {
      setError(error.message || "Failed to log in. Please check your credentials.")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={emailError ? "input-error" : ""}
              required 
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={passwordError ? "input-error" : ""}
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