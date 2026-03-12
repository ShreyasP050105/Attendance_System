import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";

function RegisterPage() {
  const API_URL = import.meta.env.VITE_API_URL || "https://attendance-system-9nt4.onrender.com";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/users/register`, {
        name,
        email,
        password,
      });

      setSuccess("Account created successfully! Redirecting…");
      setTimeout(() => navigate("/student-login"), 1500);
    } catch (err) {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="glass-card form-card">
        <h1>🎓 AttendX</h1>
        <h2>Create Account</h2>

        {error && <div className="error-inline">{error}</div>}
        {success && <div className="success-inline">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              className="glass-input"
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              className="glass-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              className="glass-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <FaUserPlus /> Register
              </>
            )}
          </button>
        </form>

        <p className="form-footer">
          Already have an account? <Link to="/student-login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;