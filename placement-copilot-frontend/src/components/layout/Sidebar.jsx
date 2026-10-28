import {
  LayoutDashboard,
  FileText,
  BriefcaseBusiness,
  BookOpen,
  MessageSquare,
  History,
  Settings,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/authApi";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Resume Analyzer",
    icon: FileText,
  },
  {
    label: "Job Matcher",
    icon: BriefcaseBusiness,
  },
  {
    label: "Study Planner",
    icon: BookOpen,
  },
  {
    label: "Interview",
    icon: MessageSquare,
  },
  {
    label: "History",
    icon: History,
  },
];


function Sidebar({ currentPage, setCurrentPage, onLogout }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((data) => setProfile(data))
      .catch((error) => {
        console.error("Profile loading failed:", error);
      });
  }, []);

  const userName = profile?.name || "User";
  const userRole = profile?.targetRole || "Student";

  return (

    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Sparkles size={18} />
        </div>

        <span>Placement Copilot</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="nav-label">Workspace</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`nav-item ${
                currentPage === item.label ? "active" : ""
              }`}
              onClick={() => setCurrentPage(item.label)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <p className="nav-label settings-label">Account</p>

        <button className="nav-item">
          <Settings size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </button>

      </nav>

      {/* Bottom Profile */}
      <div className="sidebar-bottom">

        <div className="sidebar-profile">

          <div className="avatar">
            <span>{userName.charAt(0).toUpperCase()}</span>
          </div>

          <div className="profile-info">
            <strong>{userName}</strong>
            <span>{userRole}</span>
          </div>

          <span className="profile-dot"></span>

        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          <span>Log out</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;