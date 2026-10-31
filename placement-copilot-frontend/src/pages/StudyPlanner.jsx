
import { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Clock,
  CalendarDays,
  CheckCircle2,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import {
  generateStudyPlan,
  getStudyPlanHistory,
} from "../services/studyPlanApi";
import { getToken } from "../services/authApi";
import "./StudyPlanner.css";

function StudyPlanner() {
  const [numberOfDays, setNumberOfDays] = useState(30);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [studyTopic, setStudyTopic] = useState("");
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPlanMinimized, setIsPlanMinimized] = useState(false);
  const [savedPlans, setSavedPlans] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [historyLoaded, setHistoryLoaded] = useState(false);


const handleGeneratePlan = async () => {
  try {
    setLoading(true);
    setError("");
    setStudyPlan(null);

    const token = getToken();

    if (!token) {
      throw new Error("Please log in again to continue.");
    }

    if (!studyTopic.trim()) {
      throw new Error("Please enter a topic you want to learn.");
    }

    const request = {
      topic: studyTopic.trim(),
      numberOfDays: Number(numberOfDays),
      hoursPerDay: Number(hoursPerDay),
    };
    const result = await generateStudyPlan(request, token);

    setStudyPlan(result);
  } catch (err) {
    console.error("Study plan generation failed:", err);
    setError(err.message || "Unable to generate your study plan.");
  } finally {
    setLoading(false);
  }
};


  const handleLoadHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please log in again to continue.");
      }

      const plans = await getStudyPlanHistory(token);
      setSavedPlans(Array.isArray(plans) ? plans : []);
      setHistoryLoaded(true);
    } catch (err) {
      setHistoryError(err.message || "Unable to load saved plans.");
    } finally {
      setHistoryLoading(false);
    }
  };


  return (
    <div className="study-planner-page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">STUDY PLANNER</p>
          <h1>Your path to placement.</h1>
          <p className="page-subtitle">
            Turn your placement goals into a structured,
            personalized daily learning plan.
          </p>
        </div>
      </div>

      <section className="study-config-card">
        <div className="study-section-heading">
          <div className="study-icon">
            <Sparkles size={19} />
          </div>
          <div>
            <h3>Build your study plan</h3>
            <p>Choose a schedule that works for you.</p>
          </div>
        </div>
        <div className="study-field study-topic-field">
          <label htmlFor="study-topic">
            <BookOpen size={15} />
            What do you want to learn?
          </label>

          <input
            id="study-topic"
            type="text"
            placeholder="e.g. Java, DSA, Machine Learning..."
            value={studyTopic}
            onChange={(e) => setStudyTopic(e.target.value)}
            maxLength={150}
          />
        </div>
        <div className="study-config-grid">
          <div className="study-field">
            <label htmlFor="study-days">
              <CalendarDays size={15} />
              Preparation duration
            </label>

            <select
              id="study-days"
              value={numberOfDays}
              onChange={(e) =>
                setNumberOfDays(Number(e.target.value))
              }
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={45}>45 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>

          <div className="study-field">
            <label htmlFor="study-hours">
              <Clock size={15} />
              Daily study time
            </label>

            <select
              id="study-hours"
              value={hoursPerDay}
              onChange={(e) =>
                setHoursPerDay(Number(e.target.value))
              }
            >
              <option value={1}>1 hour/day</option>
              <option value={2}>2 hours/day</option>
              <option value={3}>3 hours/day</option>
              <option value={4}>4 hours/day</option>
              <option value={5}>5 hours/day</option>
              <option value={6}>6 hours/day</option>
            </select>
          </div>
        </div>

        <div className="study-plan-summary">
          <div>
            <span>Total preparation time</span>
            <strong>{numberOfDays * hoursPerDay} hours</strong>
          </div>
          <div>
            <span>Your learning topic</span>
            <strong>{studyTopic.trim() || "Enter a topic below"}</strong>
          </div>
        </div>

        <button
          className="generate-study-button"
          onClick={handleGeneratePlan}
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle size={17} className="study-spinner" />
          ) : (
            <Sparkles size={17} />
          )}
          {loading ? "Generating your plan..." : "Generate Study Plan"}
        </button>

        {error && (
          <div className="study-error">
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          className="history-study-button"
          onClick={handleLoadHistory}
          disabled={historyLoading}
        >
          {historyLoading ? "Loading saved plans..." : "View Saved Plans"}
        </button>

        {historyError && (
          <div className="study-error">
            <AlertCircle size={17} />
            <span>{historyError}</span>
          </div>
        )}
      </section>

{studyPlan && (
  <section className={`generated-study-plan ${isPlanMinimized ? "plan-minimized" : ""}`}>
    <div className="generated-plan-header">
      <div>
        <p className="page-eyebrow">YOUR PERSONAL ROADMAP</p>
        <h2>{studyPlan.targetRole || "Your Study Plan"}</h2>
        <p className="page-subtitle">
          {studyPlan.totalDays} days of structured preparation
        </p>
      </div>

      <div className="plan-header-actions">
        <div className="plan-total-badge">
          <BookOpen size={17} />
          {studyPlan.days?.length || 0} study days
        </div>

        <button
          type="button"
          className="minimize-plan-button"
          onClick={() => setIsPlanMinimized((previous) => !previous)}
        >
          {isPlanMinimized ? "Expand Plan ↓" : "Minimize Plan ↑"}
        </button>
      </div>
    </div>

    {!isPlanMinimized && (
      <div className="study-day-list">
        {(studyPlan.days || []).map((day, index) => (
          <article
            className="study-day-card"
            key={day.day ?? index}
          >
            <div className="study-day-number">
              {String(day.day).padStart(2, "0")}
            </div>

            <div className="study-day-content">
              <div className="study-day-heading">
                <div>
                  <span className="study-day-label">
                    DAY {day.day}
                  </span>
                  <h3>{day.topic}</h3>
                </div>

                <span className="study-hours-badge">
                  <Clock size={13} />
                  {day.estimatedHours}h
                </span>
              </div>

              <ul className="study-task-list">
                {(day.tasks || []).map((task, taskIndex) => (
                  <li key={taskIndex}>
                    <CheckCircle2 size={15} />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>
)}

      {historyLoaded && (
        <section className="saved-study-plans">
          <div className="generated-plan-header">
            <div>
              <p className="page-eyebrow">YOUR HISTORY</p>
              <h2>Saved Study Plans</h2>
              <p className="page-subtitle">
                Revisit a plan you generated earlier.
              </p>
            </div>
          </div>

          {savedPlans.length > 0 ? (
            <div className="saved-plans-list">
              {savedPlans.map((plan, index) => (
                <article className="saved-plan-card" key={index}>
                  <div>
                    <h3>{plan.targetRole || "Study Plan"}</h3>
                    <p>
                      {plan.totalDays} days ·{" "}
                      {plan.days?.length || 0} study days
                    </p>
                    <span>Plan {index + 1}</span>
                  </div>

                  <button
                    type="button"
                    className="history-study-button"
                    onClick={() => {
                      setStudyPlan(plan);
                      setIsPlanMinimized(false);
                    }}
                  >
                    View Plan
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <p className="saved-plans-empty">
              No saved study plans found. Generate a plan first.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

export default StudyPlanner;
