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

function Sidebar({ currentPage, setCurrentPage , onLogout}) {
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
            N
          </div>

          <div className="profile-info">
            <strong>Nandita</strong>
            <span>Student</span>
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