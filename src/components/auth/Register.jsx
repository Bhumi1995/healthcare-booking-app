"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userType, setUserType] = useState("patient")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    try {
      await register(name, email, password)
      navigate("/patient") // Redirect to dashboard after successful registration
    } catch (error) {
      setError(error.message || "Failed to create account")
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
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
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

          <Link to='/login' type="submit" className="btn btn-primary">
            Register
          </Link>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  )
}

export default Register
