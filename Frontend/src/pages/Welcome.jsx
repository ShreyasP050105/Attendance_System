import { useNavigate } from "react-router-dom";
import { FaUserGraduate, FaUserShield } from "react-icons/fa";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-crown">👑</div>
      <h1>AttendX</h1>
      <p className="welcome-sub">Smart Attendance Tracking — Simplified</p>

      <div className="role-cards">
        <div
          className="role-card student"
          onClick={() => navigate("/student-login")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/student-login")}
        >
          <span className="role-icon">
            <FaUserGraduate />
          </span>
          <div className="role-title">Student</div>
          <div className="role-desc">Track your attendance & analytics</div>
        </div>

        <div
          className="role-card admin"
          onClick={() => navigate("/admin-login")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/admin-login")}
        >
          <span className="role-icon">
            <FaUserShield />
          </span>
          <div className="role-title">Admin</div>
          <div className="role-desc">Manage students & monitor records</div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;