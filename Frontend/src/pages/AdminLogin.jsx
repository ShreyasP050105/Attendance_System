import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserShield } from "react-icons/fa";

function AdminLogin() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      if (!res.data.user) {
        setError("Invalid credentials");
        return;
      }

      if (res.data.user.role !== "admin") {
        setError("This account is not an admin account.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="glass-card form-card">
        <h1>🛡️ AttendX</h1>
        <h2>Admin Login</h2>

        {error && <div className="error-inline">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              className="glass-input"
              type="email"
              placeholder="Admin email"
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
                <FaSignInAlt /> Login
              </>
            )}
          </button>
        </form>

        <p className="form-footer">
          No admin account? <Link to="/admin-register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;