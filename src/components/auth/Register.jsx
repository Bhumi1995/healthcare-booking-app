

"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
// import { Link } from "react-router-dom"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userType, setUserType] = useState("patient")
  const [error, setError] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  // Track which fields have been touched
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  // Validation functions
  const getNameError = () => {
    if (!name.trim()) return "Name is required"
    if (name.trim().length < 4) return "Name must be at least 4 characters"
    return ""
  }

  const getEmailError = () => {
    if (!email) return "Email is required"
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address"
    return ""
  }

  const getPasswordError = () => {
    if (!password) return "Password is required"
    if (password.length < 6) return "Password must be at least 6 characters"
    return ""
  }

  const getConfirmPasswordError = () => {
    if (!confirmPassword) return "Please confirm your password"
    if (password !== confirmPassword) return "Passwords do not match"
    return ""
  }

  // Check if the form has any errors
  const hasErrors = () => {
    return !!(getNameError() || getEmailError() || getPasswordError() || getConfirmPasswordError())
  }

  // Handle field changes
  const handleChange = (field, value, setter) => {
    setter(value)
    setTouched((prev) => ({ ...prev, [field]: true }))

    // Clear global error when user starts typing
    if (formSubmitted) {
      setError("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitted(true)

    // Check if there are any validation errors
    if (hasErrors()) {
      return setError("Please fill all the fields correctly")
    }

    try {
      await register(name, email, password)
      navigate("/login")
    } catch (err) {
      setError(err.message || "Registration failed")
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => handleChange("name", e.target.value, setName)} />
            {touched.name && getNameError() && <div className="field-error">{getNameError()}</div>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => handleChange("email", e.target.value, setEmail)} />
            {touched.email && getEmailError() && <div className="field-error">{getEmailError()}</div>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => handleChange("password", e.target.value, setPassword)}
            />
            {touched.password && getPasswordError() && (
              <div className="field-error">{getPasswordError()}</div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value, setConfirmPassword)}
            />
            {touched.confirmPassword && getConfirmPasswordError() && (
              <div className="field-error">{getConfirmPasswordError()}</div>
            )}
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
            Register
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  )
}

export default Register

