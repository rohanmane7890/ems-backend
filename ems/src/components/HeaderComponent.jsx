import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { getEmployeeByEmail, getNotifications, markNotificationAsRead } from '../services/EmployeeService'

const HeaderComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("loggedInEmail");
  
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (role === "EMPLOYEE" && email) {
      fetchEmployeeAndNotifications();
      const interval = setInterval(fetchNotifsOnly, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [role, email]);

  const fetchEmployeeAndNotifications = async () => {
    try {
      const empRes = await getEmployeeByEmail(email);
      const empId = empRes.data.id;
      setEmployeeId(empId);
      const notifRes = await getNotifications(empId);
      setNotifications(notifRes.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const fetchNotifsOnly = async () => {
      if (employeeId) {
          try {
              const res = await getNotifications(employeeId);
              setNotifications(res.data);
          } catch {}
      }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const toggleNotif = () => setShowNotif(!showNotif);

  const handleMarkRead = async (id) => {
      try {
          await markNotificationAsRead(id);
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      } catch {}
  };

  // Close when clicking outside
  useEffect(() => {
      const handleClickOutside = (e) => {
          if (notifRef.current && !notifRef.current.contains(e.target)) {
              setShowNotif(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0;

  // 📝 List of pages where the Navbar should NOT be shown
  const publicRoutes = ["/", "/login", "/employee-login", "/admin-login", "/register"];

  // 🚫 Security Gate: Hide navbar on login pages or if not authenticated
  if (publicRoutes.includes(location.pathname) || !role || !email) {
      return null;
  }

  return (
    <div>
    <header className="sticky-top shadow-sm">
      <nav className="navbar navbar-expand-lg py-3" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2" href="/" style={{ color: "#fff", fontWeight: "800", letterSpacing: "0.5px" }}>
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: "35px", height: "35px" }}>
                <i className="ri-pulse-line text-white"></i>
            </div>
            <span style={{ fontSize: "1.4rem" }}>Pulse <span className="text-primary">EMS</span></span>
          </a>

          <button className="navbar-toggler border-0 shadow-none text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <i className="ri-menu-3-line fs-3"></i>
          </button>
          
          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
              {role === "ADMIN" && (
                <>
                  <li className="nav-item">
                    <NavLink to="/admin-dashboard" className={({isActive}) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-white-50 hover-light'}`}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/employees" className={({isActive}) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-white-50 hover-light'}`}>
                      Directory
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/search" className={({isActive}) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-white-50 hover-light'}`}>
                      Search
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/admin/leaves" className={({isActive}) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-white-50 hover-light'}`}>
                      Leave Mgmt
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/admin/attendance" className={({isActive}) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-white-50 hover-light'}`}>
                      Attendance
                    </NavLink>
                  </li>
                </>
              )}

              {role === "EMPLOYEE" && (
                <>
                  <li className="nav-item">
                    <NavLink to="/employee-dashboard" className={({isActive}) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-white-50 hover-light'}`}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/employee-profile" className={({isActive}) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-white-50 hover-light'}`}>
                      My Profile
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/attendance" className={({isActive}) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-white-50 hover-light'}`}>
                      Attendance
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/leaves" className={({isActive}) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-white-50 hover-light'}`}>
                      Leaves
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/employee-salary" className={({isActive}) => `nav-link px-3 py-2 rounded-pill ${isActive ? 'active bg-primary text-white fw-bold shadow-sm' : 'text-white-50 hover-light'}`}>
                      Salary
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
             {(role && role.toUpperCase() === "EMPLOYEE") && (
                 <div className="position-relative" ref={notifRef}>
                    <button className="btn btn-link text-white p-2 position-relative shadow-none d-flex align-items-center gap-1 text-decoration-none" onClick={toggleNotif}>
                        <i className="ri-notification-3-line fs-4"></i>
                        <span className="small d-none d-sm-inline">Notifications</span>
                        {unreadCount > 0 && (
                            <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem", marginLeft: "15px", marginTop: "5px" }}>
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotif && (
                        <div className="dropdown-menu show shadow-lg border-0 p-0" 
                             style={{ position: 'absolute', right: 0, top: '120%', width: '320px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', zIndex: 1060 }}>
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                                <span className="fw-bold small text-dark">Notifications</span>
                                <span className="badge bg-primary rounded-pill small">{unreadCount} New</span>
                            </div>
                            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-muted small">
                                        <i className="ri-chat-history-line fs-2 d-block mb-2 opacity-25"></i>
                                        No notifications yet
                                    </div>
                                ) : (
                                    notifications.slice().reverse().map((n) => (
                                        <div key={n.id} 
                                             className={`p-3 border-bottom position-relative ${n.isRead ? '' : 'bg-primary bg-opacity-10'}`}
                                             onClick={() => !n.isRead && handleMarkRead(n.id)}
                                             style={{ cursor: 'pointer' }}>
                                            <div className={`small ${n.isRead ? 'text-muted' : 'fw-bold text-dark'}`}>{n.message}</div>
                                            <div className="text-muted mt-1" style={{ fontSize: '0.65rem' }}>
                                                <i className="ri-time-line me-1"></i>
                                                {new Date(n.createdAt).toLocaleString()}
                                            </div>
                                            {!n.isRead && <div className="position-absolute top-50 end-0 translate-middle-y me-2" style={{ width: '8px', height: '8px', backgroundColor: '#0d6efd', borderRadius: '50%' }}></div>}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                 </div>
             )}

             {role && (
                <button className="btn btn-outline-light btn-sm px-3 rounded-pill" onClick={handleLogout}>
                    Logout
                </button>
             )}
          </div>
          </div>
        </div>
      </nav>

      <style>{`
        .hover-light:hover {
          color: white !important;
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-link {
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        .navbar-toggler:focus {
          box-shadow: none;
        }
      `}</style>
    </header>
    </div>
  )
}

export default HeaderComponent;
