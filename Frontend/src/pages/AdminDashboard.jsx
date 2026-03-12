import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaSignOutAlt,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaUserGraduate,
  FaEnvelope,
} from "react-icons/fa";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin-login");
      return;
    }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students");

      // The admin route returns { success, students: [...] }
      if (res.data.students) {
        setStudents(res.data.students);
      } else if (Array.isArray(res.data)) {
        setStudents(res.data);
      } else {
        setStudents([]);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Failed to load student data.");
      setLoading(false);
    }
  };

  const getStatus = (percentage) => {
    const p = parseFloat(percentage);
    if (p >= 75) return { text: "Safe", class: "safe" };
    if (p >= 65) return { text: "Warning", class: "warning" };
    return { text: "Danger", class: "danger" };
  };

  const toggleExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Calculate some admin stats
  const totalStudents = students.length;
  const safeStudents = students.filter((s) => parseFloat(s.percentage) >= 75).length;
  const dangerStudents = students.filter((s) => parseFloat(s.percentage) < 65).length;

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">🛡️</span>
          AttendX Admin
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Admin: <strong style={{ color: "var(--gold)" }}>{user?.name}</strong>
          </span>
          <button className="btn btn-danger btn-sm" onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-body">
        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--success)" }}>
              {safeStudents}
            </div>
            <div className="stat-label">Safe Zone (≥75%)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: "var(--danger)" }}>
              {dangerStudents}
            </div>
            <div className="stat-label">Danger Zone (&lt;65%)</div>
          </div>
        </div>

        {/* ERROR / LOADING */}
        {error && <div className="error-inline">{error}</div>}

        {loading ? (
          <div className="glass-card-static" style={{ textAlign: "center", padding: "60px" }}>
            <div className="spinner" style={{ margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text-muted)" }}>Loading student data…</p>
          </div>
        ) : (
          <>
            {/* STUDENT TABLE */}
            <div className="section-header">
              <FaUsers className="header-accent" /> Student Records
            </div>

            {students.length === 0 ? (
              <div className="glass-card-static" style={{ textAlign: "center", padding: "60px 24px" }}>
                <FaUserGraduate style={{ fontSize: "40px", color: "var(--text-muted)", marginBottom: "16px" }} />
                <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>No students registered yet.</p>
              </div>
            ) : (
              <div className="glass-table-wrap">
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Subjects</th>
                      <th>Overall %</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => {
                      const status = getStatus(student.percentage);
                      const isExpanded = expandedRow === index;

                      return (
                        <React.Fragment key={`student-${index}`}>
                          <tr>
                            <td>{index + 1}</td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <FaUserGraduate style={{ color: "var(--royal-light)" }} />
                                {student.name}
                              </div>
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <FaEnvelope style={{ color: "var(--text-muted)", fontSize: "12px" }} />
                                {student.email}
                              </div>
                            </td>
                            <td>{student.subjects?.length || 0}</td>
                            <td>
                              <strong style={{
                                color: status.class === "safe" ? "var(--success)" : status.class === "warning" ? "var(--warning)" : "var(--danger)"
                              }}>
                                {student.percentage}%
                              </strong>
                            </td>
                            <td>
                              <span className={`badge badge-${status.class}`}>
                                {status.text}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => toggleExpand(index)}
                                style={{ padding: "6px 12px" }}
                              >
                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                            </td>
                          </tr>

                          {/* Expandable detail row */}
                          {isExpanded && (
                            <tr key={`detail-${index}`} className="student-detail-row">
                              <td colSpan={7}>
                                <div className="student-detail-inner">
                                  {student.subjects && student.subjects.length > 0 ? (
                                    <div className="student-subject-grid">
                                      {student.subjects.map((sub, i) => {
                                        const subPercent = sub.total > 0
                                          ? ((sub.attended / sub.total) * 100).toFixed(1)
                                          : "0.0";
                                        const subStatus = parseFloat(subPercent) >= 75 ? "safe" : parseFloat(subPercent) >= 65 ? "warning" : "danger";

                                        return (
                                          <div key={i} className="student-subject-mini">
                                            <div className="mini-name">{sub.name}</div>
                                            <div className="mini-stat">
                                              Attended: {sub.attended || 0} / {sub.total || 0}
                                            </div>
                                            <div className="progress-track" style={{ marginTop: "8px" }}>
                                              <div
                                                className="progress-fill"
                                                data-status={subStatus}
                                                style={{ width: `${Math.min(subPercent, 100)}%` }}
                                              />
                                            </div>
                                            <div style={{
                                              fontSize: "13px",
                                              fontWeight: "600",
                                              marginTop: "4px",
                                              color: subStatus === "safe" ? "var(--success)" : subStatus === "warning" ? "var(--warning)" : "var(--danger)"
                                            }}>
                                              {subPercent}%
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
                                      No subjects added by this student.
                                    </p>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;