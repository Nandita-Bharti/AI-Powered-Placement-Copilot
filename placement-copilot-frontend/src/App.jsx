import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Login from "./pages/Login";
import JobMatcher from "./pages/JobMatcher";
import { isAuthenticated, logoutUser } from "./services/authApi";
import StudyPlanner from "./pages/StudyPlanner";
import ProfileSetup from "./pages/ProfileSetup";

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const handleLogin = ({ isNewUser = false } = {}) => {
    setAuthenticated(true);
    setCurrentPage(isNewUser ? "Profile Setup" : "Dashboard");
  };

  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "Resume Analyzer":
        return <ResumeAnalyzer />;

      case "Job Matcher":
          return <JobMatcher />;

      case "Study Planner":
            return <StudyPlanner />;

      case "Profile Setup":
        return (
          <ProfileSetup
            onComplete={() => setCurrentPage("Dashboard")}
          />
        );

      case "Dashboard":
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;