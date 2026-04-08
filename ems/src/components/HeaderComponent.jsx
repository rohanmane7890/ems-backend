import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, NavLink, useLocation, Link } from 'react-router-dom'
import { 
    FaBolt, FaHome, FaUsers, FaSearch, FaCalendarAlt, FaFileAlt, 
    FaUserCircle, FaCalendarCheck, FaTasks, FaWallet, FaSignOutAlt, FaBell 
} from 'react-icons/fa'
import { getEmployeeByEmail, getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/EmployeeService'

const HeaderComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("loggedInEmail");
  
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const notifRef = useRef(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (email) {
      if (role === "EMPLOYEE") {
        fetchEmployeeAndNotifications();
      } else if (role === "ADMIN") {
        fetchAdminNotifications();
      }
      const interval = setInterval(fetchNotifsOnly, 30000);
      return () => clearInterval(interval);
    }
  }, [role, email]);

  const fetchAdminNotifications = async () => {
    try {
      const empId = localStorage.getItem("employeeId") || "-1";
      setEmployeeId(empId);
      const notifRes = await getNotifications(empId);
      setNotifications(notifRes.data);
    } catch (error) {
      console.error("Error fetching admin notifications", error);
    }
  };

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
    navigate("/");
  };

  const toggleNotif = () => setShowNotif(!showNotif);

  const handleMarkRead = async (id) => {
      try {
          await markNotificationAsRead(id);
          setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      } catch {}
  };

  const handleMarkAllRead = async () => {
      if (employeeId) {
          try {
              await markAllNotificationsAsRead(employeeId);
              setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          } catch (error) {
              console.error("Error marking all as read", error);
          }
      }
  };

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
  const publicRoutes = ["/", "/login", "/employee-login", "/admin-login", "/register"];

  if (publicRoutes.includes(location.pathname) || !role || !email) {
      return null;
  }

  const NavItem = ({ to, icon: Icon, label }) => (
    <li className="nav-item">
      <NavLink 
        to={to} 
        className={({isActive}) => `elite-nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-pill ${isActive ? 'active' : ''}`}
      >
        <Icon className="nav-icon" />
        <span className="nav-label">{label}</span>
      </NavLink>
    </li>
  );

  return (
    <header className="sticky-top shadow-xl">
      <nav className="navbar navbar-expand-lg py-2" style={{ 
          background: "rgba(15, 23, 42, 0.95)", 
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)" 
      }}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center me-4" to="/" style={{ letterSpacing: "-0.5px" }}>
            <div className="bg-primary rounded-3 p-2 me-2 d-flex align-items-center justify-content-center shadow-lg" style={{ width: "35px", height: "35px" }}>
              <FaBolt className="text-white fs-5" />
            </div>
            <span className="fw-bold text-white fs-5">NexGen<span className="fw-light opacity-50 ms-1">Workforce</span></span>
          </Link>

          <button className="navbar-toggler border-0 shadow-none" type="button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
                <span></span><span></span><span></span>
            </div>
          </button>
          
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav mx-auto gap-1">
              {role === "ADMIN" ? (
                <>
                  <NavItem to="/admin-dashboard" icon={FaHome} label="Dashboard" />
                  <NavItem to="/employees" icon={FaUsers} label="Personnel" />
                  <NavItem to="/search" icon={FaSearch} label="Search" />
                  <NavItem to="/admin/leaves" icon={FaCalendarCheck} label="Leaves" />
                  <NavItem to="/admin/attendance" icon={FaCalendarAlt} label="Tracking" />
                  <NavItem to="/admin/work-reports" icon={FaFileAlt} label="Work Report" />
                </>
              ) : (
                <>
                  <NavItem to="/employee-dashboard" icon={FaHome} label="Dashboard" />
                  <NavItem to="/employee-profile" icon={FaUserCircle} label="Profile" />
                  <NavItem to="/attendance" icon={FaCalendarAlt} label="Attendance" />
                  <NavItem to="/leaves" icon={FaCalendarCheck} label="Leaves" />
                  <NavItem to="/employee-worklogs" icon={FaTasks} label="Work Logs" />
                  <NavItem to="/employee-salary" icon={FaWallet} label="Payroll" />
                </>
              )}
            </ul>

            <div className="d-flex align-items-center gap-2 mt-4 mt-lg-0">
              {(role === "EMPLOYEE" || role === "ADMIN") && (
                 <div className="position-relative" ref={notifRef}>
                    <button className="notification-trigger" onClick={toggleNotif}>
                        <FaBell className="fs-5" />
                        {unreadCount > 0 && <span className="notification-ping">{unreadCount}</span>}
                    </button>

                    {showNotif && (
                        <div className="elite-dropdown shadow-2xl">
                            <div className="p-3 border-bottom border-white border-opacity-5 d-flex justify-content-between align-items-center bg-white bg-opacity-5">
                                <span className="fw-bold small text-white">Notifications</span>
                                {unreadCount > 0 && (
                                    <button className="btn btn-link btn-sm text-primary text-decoration-none small" onClick={handleMarkAllRead}>
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="notification-list custom-scroll" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                {notifications.length === 0 || notifications.filter(n => !n.isRead).length === 0 ? (
                                    <div className="p-4 text-center text-white-50 small opacity-50">
                                        No unread alerts
                                    </div>
                                ) : (
                                    notifications.filter(n => !n.isRead).slice().reverse().map((n) => (
                                        <div key={n.id} 
                                             className="notification-item p-3 border-bottom border-white border-opacity-5"
                                             onClick={() => handleMarkRead(n.id)}>
                                            <div className="small text-white opacity-90">{n.message}</div>
                                            <div className="text-white-50 x-small mt-1">
                                                {new Date(n.createdAt).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                  </div>
              )}

                <button className="logout-btn gap-2" onClick={handleLogout}>
                    <FaSignOutAlt className="small" />
                    <span>Logout</span>
                </button>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        .elite-nav-link {
          color: rgba(255, 255, 255, 0.6) !important;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }
        .elite-nav-link:hover {
          color: white !important;
          background: rgba(255, 255, 255, 0.05);
        }
        .elite-nav-link.active {
          color: #fff !important;
          background: rgba(37, 99, 235, 0.1);
          border: 1px solid rgba(37, 99, 235, 0.2);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.1);
        }
        .nav-icon {
          font-size: 1.1rem;
          opacity: 0.7;
        }
        .active .nav-icon {
          color: #3b82f6;
          opacity: 1;
        }
        .notification-trigger {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.2s ease;
        }
        .notification-trigger:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .notification-ping {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          font-size: 0.65rem;
          font-weight: bold;
          min-width: 18px;
          height: 18px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #0f172a;
        }
        .elite-dropdown {
          position: absolute;
          right: 0;
          top: 55px;
          width: 320px;
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          z-index: 1000;
        }
        .notification-item {
          transition: background 0.2s ease;
          cursor: pointer;
        }
        .notification-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .logout-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          padding: 8px 20px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }
        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
        }
        .text-primary-gradient {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .x-small { font-size: 0.65rem; }
        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: white;
          margin: 5px 0;
          transition: 0.4s;
        }
        .hamburger.open span:nth-child(1) { transform: rotate(-45deg) translate(-5px, 6px); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(45deg) translate(-5px, -6px); }
        
        @media (max-width: 991px) {
            .navbar-collapse {
                background: #0f172a;
                margin: 0 -1rem;
                padding: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .elite-nav-link { padding: 12px 20px !important; border-radius: 12px !important; }
        }
      `}</style>
    </header>
  )
}

export default HeaderComponent;
