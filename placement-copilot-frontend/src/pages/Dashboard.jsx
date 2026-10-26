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

function Dashboard() {
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
            Good evening, Nandita
            <span> 👋</span>

          </h1>

          <p className="dashboard-subtitle">
            Here's an overview of your placement readiness.
          </p>
        </div>

        <button className="primary-button">
          <Sparkles size={17} />
          AI Recommendations
        </button>

      </section>


      {/* Stats */}
      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon green">
              <FileCheck2 size={19} />
            </div>

            <span className="stat-change">
              +12%
            </span>
          </div>

          <p className="stat-label">ATS Resume Score</p>

          <div className="stat-value-row">
            <h2>82</h2>
            <span>/ 100</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: "82%" }}
            ></div>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon purple">
              <BriefcaseBusiness size={19} />
            </div>

            <span className="stat-change">
              Strong
            </span>
          </div>

          <p className="stat-label">Job Match Score</p>

          <div className="stat-value-row">
            <h2>80</h2>
            <span>%</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill purple-fill"
              style={{ width: "80%" }}
            ></div>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon blue">
              <MessageSquare size={19} />
            </div>

            <span className="stat-change">
              +2.1
            </span>
          </div>

          <p className="stat-label">Interview Score</p>

          <div className="stat-value-row">
            <h2>7.8</h2>
            <span>/ 10</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill blue-fill"
              style={{ width: "78%" }}
            ></div>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-top">
            <div className="stat-icon orange">
              <BookOpen size={19} />
            </div>

            <span className="stat-change">
              4 / 7
            </span>
          </div>

          <p className="stat-label">Study Progress</p>

          <div className="stat-value-row">
            <h2>57</h2>
            <span>%</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill orange-fill"
              style={{ width: "57%" }}
            ></div>
          </div>

        </div>

      </section>


      {/* Main Grid */}
      <section className="dashboard-grid">

        {/* Readiness Card */}
        <div className="dashboard-card readiness-card">

          <div className="card-header">
            <div>
              <p className="card-eyebrow">PLACEMENT READINESS</p>
              <h3>You're making good progress.</h3>
            </div>

            <button className="card-action">
              <ArrowUpRight size={18} />
            </button>
          </div>

          <div className="readiness-content">

            <div className="readiness-score">
              <div className="score-circle">
                <div>
                  <strong>78</strong>
                  <span>%</span>
                </div>
              </div>

              <div>
                <p className="score-title">
                  Overall readiness
                </p>

                <p className="score-description">
                  You're ahead of 68% of students
                  at your current preparation level.
                </p>
              </div>
            </div>

            <div className="readiness-bars">

              <div className="skill-row">
                <div>
                  <span>Resume</span>
                  <strong>82%</strong>
                </div>

                <div className="mini-track">
                  <div
                    className="mini-fill"
                    style={{ width: "82%" }}
                  ></div>
                </div>
              </div>

              <div className="skill-row">
                <div>
                  <span>Technical Skills</span>
                  <strong>76%</strong>
                </div>

                <div className="mini-track">
                  <div
                    className="mini-fill"
                    style={{ width: "76%" }}
                  ></div>
                </div>
              </div>

              <div className="skill-row">
                <div>
                  <span>Interview</span>
                  <strong>78%</strong>
                </div>

                <div className="mini-track">
                  <div
                    className="mini-fill"
                    style={{ width: "78%" }}
                  ></div>
                </div>
              </div>

            </div>

          </div>

        </div>


        {/* AI Coach */}
        <div className="dashboard-card ai-card">

          <div className="ai-card-header">
            <div className="ai-icon">
              <Sparkles size={19} />
            </div>

            <span>AI COACH</span>
          </div>

          <h3>
            Your next best move
          </h3>

          <p>
            Your resume and job matches are strong.
            The biggest opportunity right now is
            improving your backend architecture skills.
          </p>

          <div className="ai-recommendation">

            <div className="recommendation-number">
              01
            </div>

            <div>
              <strong>
                Learn Microservices
              </strong>

              <span>
                Focus on Spring Cloud & API Gateway
              </span>
            </div>

          </div>

          <div className="ai-recommendation">

            <div className="recommendation-number">
              02
            </div>

            <div>
              <strong>
                Practice Kafka
              </strong>

              <span>
                Build an event-driven backend project
              </span>
            </div>

          </div>

          <button className="secondary-button">
            View personalized plan
            <ArrowUpRight size={16} />
          </button>

        </div>

      </section>

    </main>
    </>
  );
}

export default Dashboard;