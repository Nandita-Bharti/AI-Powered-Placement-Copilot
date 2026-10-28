import {
  ArrowUpRight,
  FileCheck2,
  BriefcaseBusiness,
  MessageSquare,
  BookOpen,
  Sparkles,
} from "lucide-react";
import "./Dashboard.css";
import Topbar from "../components/layout/Topbar";
import { useEffect, useState } from "react";
import { getUserProfile } from "../services/profileApi";
import { getSavedAnalysis } from "../services/resumeApi";
import { getLatestJobMatch } from "../services/jobMatchApi";
import { getStudyPlanHistory } from "../services/studyPlanApi";
import { getToken } from "../services/authApi";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [resumeAnalysisLoading, setResumeAnalysisLoading] = useState(true);
  const [jobMatch, setJobMatch] = useState(null);
  const [jobMatchLoading, setJobMatchLoading] = useState(true);
  const [studyPlan, setStudyPlan] = useState(null);
  const [studyPlanLoading, setStudyPlanLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadResumeAnalysis() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await getSavedAnalysis(token);

        if (active) {
          setResumeAnalysis(data);
        }
      } catch (error) {
        console.error("Could not load resume analysis:", error.message);
      } finally {
        if (active) {
          setResumeAnalysisLoading(false);
        }
      }
    }

    loadResumeAnalysis();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await getUserProfile();

        if (active) {
          setProfile(data);
        }
      } catch (error) {
        if (active) {
          setProfileError(error.message || "Could not load your profile.");
        }
      } finally {
        if (active) {
          setProfileLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

useEffect(() => {
  let active = true;

  async function loadLatestJobMatch() {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const data = await getLatestJobMatch(token);

      if (active) {
        setJobMatch(data);
      }
    } catch (error) {
      console.error("Could not load latest job match:", error.message);
    } finally {
      if (active) {
        setJobMatchLoading(false);
      }
    }
  }

  loadLatestJobMatch();

  return () => {
    active = false;
  };
}, []);


useEffect(() => {
  let active = true;

  async function loadStudyPlan() {
    try {
      const token = getToken();

      if (!token) return;

      const plans = await getStudyPlanHistory(token);

      if (active && Array.isArray(plans) && plans.length > 0) {
        setStudyPlan(plans[0]);
      }
    } catch (error) {
      console.error("Could not load study plan:", error.message);
    } finally {
      if (active) {
        setStudyPlanLoading(false);
      }
    }
  }

  loadStudyPlan();

  return () => {
    active = false;
  };
}, []);


  const userName = profile?.name?.trim() || "there";

  return (
      <>
      <Topbar />
    <main className="dashboard">

      {/* Header */}
      <section className="dashboard-header">

        <div>
          <p className="dashboard-eyebrow">
            YOUR PLACEMENT JOURNEY
          </p>

          <h1>
            {profileLoading
              ? "Loading your dashboard..."
              : `Good evening, ${userName}`}
            {!profileLoading && <span> 👋</span>}
          </h1>

          {profileError && (
            <p className="dashboard-subtitle">
              We couldn't load your profile. Please refresh and try again.
            </p>
          )}

          <p className="dashboard-subtitle">
            Here's an overview of your placement readiness.
          </p>
        </div>

        <button className="primary-button">
          <Sparkles size={19} />
          AI Recommendations
        </button>

      </section>


      {/* Stats */}
      {/* Personalized placement overview */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon green">
              <FileCheck2 size={20} />
            </div>

            <span className="stat-change">
              {resumeAnalysisLoading
                ? "Loading..."
                : resumeAnalysis
                  ? "Analysis complete"
                  : "Not started"}
            </span>
          </div>

          <p className="stat-label">ATS Resume Score</p>

          <div className="stat-value-row">
            <h2>
              {resumeAnalysisLoading
                ? "..."
                : resumeAnalysis
                  ? resumeAnalysis.atsScore
                  : "—"}
              {!resumeAnalysisLoading && resumeAnalysis && (
                <span className="stat-suffix"> / 100</span>
              )}
            </h2>
          </div>

          <p className="dashboard-subtitle">
            {resumeAnalysis
              ? "Your latest saved resume analysis score."
              : "Analyze your resume to see your score."}
          </p>
        </div>


<div className="stat-card">
  <div className="stat-top">
    <div className="stat-icon purple">
      <BriefcaseBusiness size={20} />
    </div>

    <span className="stat-change">
      {jobMatchLoading
        ? "Loading..."
        : jobMatch
          ? "Latest match"
          : "Not started"}
    </span>
  </div>

  <p className="stat-label">Job Match Score</p>

  <div className="stat-value-row">
    <h2>
      {jobMatchLoading
        ? "..."
        : jobMatch
          ? jobMatch.matchScore
          : "—"}

      {!jobMatchLoading && jobMatch && (
        <span className="stat-suffix"> / 100</span>
      )}
    </h2>
  </div>

  <p className="dashboard-subtitle">
    {jobMatch
      ? "Based on your latest job description."
      : "Analyze your resume with a job description to see your score."}
  </p>
</div>


        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon blue">
              <MessageSquare size={20} />
            </div>
            <span className="stat-change">Not started</span>
          </div>
          <p className="stat-label">Interview Practice</p>
          <div className="stat-value-row">
            <h2>—</h2>
          </div>
          <p className="dashboard-subtitle">
            Complete a mock interview to see results.
          </p>
        </div>


<div className="stat-card">
  <div className="stat-top">
    <div className="stat-icon purple">
      <BookOpen size={20} />
    </div>

    <span className="stat-change">
      {studyPlanLoading
        ? "Loading..."
        : studyPlan
          ? "Plan generated"
          : "Not started"}
    </span>
  </div>

  <p className="stat-label">Study Plan</p>

  <div className="stat-value-row">
    <h2>
      {studyPlanLoading
        ? "..."
        : studyPlan
          ? studyPlan.totalDays
          : "—"}

      {!studyPlanLoading && studyPlan && (
        <span className="stat-suffix"> days</span>
      )}
    </h2>
  </div>

  <p className="dashboard-subtitle">
    {studyPlan
      ? `${studyPlan.days?.length ?? 0} study days in your latest plan.`
      : "Generate a personalized plan to get started."}
  </p>
</div>

      </section>


      {/* Main Grid */}
      <section className="dashboard-grid">
        <div className="dashboard-card readiness-card">
          <div className="card-header">
            <div>
              <p className="card-eyebrow">YOUR NEXT STEPS</p>
              <h3>Let's build your placement readiness.</h3>
            </div>
            <Sparkles size={24} />
          </div>

          <p className="dashboard-subtitle">
            Your personalized placement journey starts here.
            Complete these activities to build your dashboard.
          </p>

          <div className="ai-recommendation">
            <div className="recommendation-number">01</div>
            <div>
              <strong>Analyze your resume</strong>
              <span>Discover your strengths and missing skills.</span>
            </div>
          </div>

          <div className="ai-recommendation">
            <div className="recommendation-number">02</div>
            <div>
              <strong>Explore job matches</strong>
              <span>Find roles that fit your skills and goals.</span>
            </div>
          </div>

          <div className="ai-recommendation">
            <div className="recommendation-number">03</div>
            <div>
              <strong>Start interview practice</strong>
              <span>Practice questions and track your results.</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card ai-card">
          <div className="ai-card-header">
            <div className="ai-icon">
              <Sparkles size={20} />
            </div>
            <span>YOUR AI COACH</span>
          </div>

          <h3>Your journey, your goals.</h3>

          <p>
            Complete your first resume analysis or job match.
            Once your results are available, your dashboard can
            show recommendations based on your actual performance.
          </p>
        </div>
      </section>

    </main>
    </>
  );
}

export default Dashboard;