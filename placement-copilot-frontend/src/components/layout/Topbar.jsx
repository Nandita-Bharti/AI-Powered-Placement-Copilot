import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

function Topbar() {
  return (
    <header className="topbar">

      <div className="topbar-left">
        <div className="breadcrumb">
          <span>Workspace</span>
          <span className="breadcrumb-separator">/</span>
          <strong>Dashboard</strong>
        </div>
      </div>

      <div className="topbar-right">

        <button className="icon-button">
          <Search size={19} strokeWidth={1.8} />
        </button>

        <button className="icon-button notification-button">
          <Bell size={19} strokeWidth={1.8} />
          <span className="notification-dot"></span>
        </button>

        <div className="topbar-profile">

          <div className="topbar-avatar">
            N
          </div>

          <div className="topbar-user">
            <strong>Nandita</strong>
            <span>Student</span>
          </div>

          <ChevronDown size={16} />

        </div>

      </div>

    </header>
  );
}

export default Topbar;