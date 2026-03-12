import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBook,
  FaSignOutAlt,
  FaPlus,
  FaCalculator,
  FaCheck,
  FaTimes,
  FaUndo,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "https://attendance-system-9nt4.onrender.com";

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name;
  const userId = user?.id;

  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/student-login");
      return;
    }
    getSubjects();
  }, []);

  const getSubjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/subjects/${userId}`);
      setSubjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ADD SUBJECT
  const handleAddSubject = async () => {
    if (newSubject.trim() === "") return;

    try {
      const res = await axios.post(`${API_URL}/api/subjects/add`, {
        userId,
        name: newSubject,
      });

      // Keep current subject list and append new subject without full reload
      setSubjects((prevSubjects) => [...prevSubjects, res.data]);
      setNewSubject("");
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE SUBJECT
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this subject?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/subjects/${id}`);
      setSubjects(subjects.filter((sub) => sub._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // HANDLE INPUT CHANGE
  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const saveSubject = async (index) => {
    const subject = subjects[index];
    if (!subject || !subject._id) return;

    const total = parseInt(subject.total || 0);
    const attended = parseInt(subject.attended || 0);

    try {
      await axios.put(`${API_URL}/api/subjects/update/${subject._id}`, {
        total,
        attended,
      });
    } catch (err) {
      console.log("Save subject error:", err);
    }
  };

  // CALCULATE ATTENDANCE
  const calculateAttendance = async (index) => {
    const updated = [...subjects];

    const total = parseInt(updated[index].total);
    const attended = parseInt(updated[index].attended);

    if (!total || !attended) return;

    const percent = (attended / total) * 100;
    updated[index].percentage = percent.toFixed(2);

    if (percent >= 75) {
      let bunk = Math.floor(attended / 0.75 - total);
      updated[index].result = `You can skip ${bunk} more classes 🎉`;
    } else {
      let need = Math.ceil((0.75 * total - attended) / (1 - 0.75));
      updated[index].result = `You must attend ${need} more classes ⚠️`;
    }

    setSubjects(updated);

    await axios.put(`${API_URL}/api/subjects/update/${updated[index]._id}`, {
      total,
      attended,
    });
  };
  const markAttended = async (index) => {
    const updated = [...subjects];

    updated[index].total = parseInt(updated[index].total) + 1;
    updated[index].attended = parseInt(updated[index].attended) + 1;

    setSubjects(updated);

    await axios.put(`${API_URL}/api/subjects/update/${updated[index]._id}`, {
      total: updated[index].total,
      attended: updated[index].attended,
    });
  };

  const markMissed = async (index) => {
    const updated = [...subjects];

    updated[index].total = parseInt(updated[index].total) + 1;

    setSubjects(updated);

    await axios.put(`${API_URL}/api/subjects/update/${updated[index]._id}`, {
      total: updated[index].total,
      attended: updated[index].attended,
    });
  };

  const calculateOverallAttendance = () => {
    if (subjects.length === 0) return 0;

    let totalClasses = 0;
    let totalAttended = 0;

    subjects.forEach((sub) => {
      totalClasses += parseInt(sub.total || 0);
      totalAttended += parseInt(sub.attended || 0);
    });

    if (totalClasses === 0) return 0;

    return ((totalAttended / totalClasses) * 100).toFixed(2);
  };

  const getLowAttendanceSubjects = () => {
    return subjects.filter((sub) => {
      const percent = sub.total && sub.attended ? (sub.attended / sub.total) * 100 : 0;
      return percent < 75 && sub.total > 0;
    });
  };

  const resetAttendance = async (index) => {
    const confirmReset = window.confirm("Reset attendance for this subject?");
    if (!confirmReset) return;

    const updated = [...subjects];

    updated[index].total = 0;
    updated[index].attended = 0;
    updated[index].percentage = 0;
    updated[index].result = "";

    setSubjects(updated);

    try {
      await axios.put(`${API_URL}/api/subjects/update/${updated[index]._id}`, {
        total: 0,
        attended: 0,
      });
    } catch (err) {
      console.log(err);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const overall = calculateOverallAttendance();
  const overallStatus = overall >= 75 ? "safe" : overall >= 65 ? "warning" : "danger";
  const lowSubs = getLowAttendanceSubjects();

  const getSubjectPercent = (sub) => {
    if (!sub.total || sub.total === 0) return 0;
    return ((sub.attended / sub.total) * 100).toFixed(2);
  };

  const getSubjectStatus = (percent) => {
    if (percent >= 75) return "safe";
    if (percent >= 65) return "warning";
    return "danger";
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">👑</span>
          AttendX
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Welcome, <strong style={{ color: "var(--gold)" }}>{userName}</strong>
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
            <div className="stat-value">{overall}%</div>
            <div className="stat-label">Overall Attendance</div>
            <div className="progress-track" style={{ marginTop: "12px" }}>
              <div
                className="progress-fill"
                data-status={overallStatus}
                style={{ width: `${Math.min(overall, 100)}%` }}
              />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{subjects.length}</div>
            <div className="stat-label">Total Subjects</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: lowSubs.length > 0 ? "var(--danger)" : "var(--success)" }}>
              {lowSubs.length}
            </div>
            <div className="stat-label">Below 75%</div>
          </div>
        </div>

        {/* LOW ATTENDANCE ALERT */}
        {lowSubs.length > 0 && (
          <div className="alert-box alert-box-danger">
            <FaExclamationTriangle className="alert-icon" />
            <div className="alert-content">
              <div className="alert-title">Low Attendance Alert</div>
              {lowSubs.map((sub, i) => {
                const p = ((sub.attended / sub.total) * 100).toFixed(2);
                return (
                  <div key={i} style={{ fontSize: "14px", marginTop: "4px" }}>
                    {sub.name} → <strong>{p}%</strong>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ADD SUBJECT */}
        <div className="section-header">
          <FaPlus className="header-accent" /> Add Subject
        </div>

        <div className="add-subject-row">
          <input
            className="glass-input"
            type="text"
            placeholder="Enter subject name…"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
          />
          <button className="btn btn-primary" onClick={handleAddSubject}>
            <FaPlus /> Add
          </button>
        </div>

        {/* SUBJECT CARDS */}
        {subjects.map((sub, index) => {
          const percent = getSubjectPercent(sub);
          const status = getSubjectStatus(percent);

          return (
            <div key={sub._id || index} className="subject-card" style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="subject-header">
                <div className="subject-name">
                  <FaBook className="subject-icon" />
                  {sub.name}
                </div>
                <span className={`badge badge-${status}`}>
                  {status === "safe" ? "Safe" : status === "warning" ? "Warning" : "Danger"}
                </span>
              </div>

              <div className="subject-inputs">
                <input
                  className="glass-input"
                  type="number"
                  placeholder="Total classes"
                  value={sub.total || ""}
                  onChange={(e) => handleChange(index, "total", e.target.value)}
                  onBlur={() => saveSubject(index)}
                />
                <input
                  className="glass-input"
                  type="number"
                  placeholder="Classes attended"
                  value={sub.attended || ""}
                  onChange={(e) => handleChange(index, "attended", e.target.value)}
                  onBlur={() => saveSubject(index)}
                />
              </div>

              <div className="subject-actions">
                <button className="btn btn-royal btn-sm" onClick={() => calculateAttendance(index)}>
                  <FaCalculator /> Calculate
                </button>
                <button className="btn btn-success btn-sm" onClick={() => markAttended(index)}>
                  <FaCheck /> Attended
                </button>
                <button className="btn btn-warning btn-sm" onClick={() => markMissed(index)}>
                  <FaTimes /> Missed
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => resetAttendance(index)}>
                  <FaUndo /> Reset
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sub._id)}>
                  <FaTrash /> Delete
                </button>
              </div>

              <div className="attendance-display">
                <span
                  className="attendance-percent"
                  style={{
                    color: status === "safe" ? "var(--success)" : status === "warning" ? "var(--warning)" : "var(--danger)",
                  }}
                >
                  {sub.percentage || percent}%
                </span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  data-status={status}
                  style={{ width: `${Math.min(sub.percentage || percent, 100)}%` }}
                />
              </div>

              {sub.result && (
                <div
                  className="attendance-result"
                  style={{
                    background: status === "safe" ? "var(--success-dim)" : "var(--danger-dim)",
                    color: status === "safe" ? "var(--success)" : "var(--danger)",
                    border: `1px solid ${status === "safe" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}
                >
                  {sub.result}
                </div>
              )}
            </div>
          );
        })}

        {subjects.length === 0 && (
          <div className="glass-card-static" style={{ textAlign: "center", padding: "60px 24px" }}>
            <FaBook style={{ fontSize: "40px", color: "var(--text-muted)", marginBottom: "16px" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
              No subjects yet. Add your first subject above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;