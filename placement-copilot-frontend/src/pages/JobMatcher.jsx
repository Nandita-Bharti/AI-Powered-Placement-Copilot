import { useState } from "react";
import {
  BriefcaseBusiness,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { matchJob } from "../services/jobMatchApi";
import { getToken } from "../services/authApi";

import "./JobMatcher.css";

function JobMatcher() {
  const [jobDescription, setJobDescription] = useState("");
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [error, setError] = useState("");

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    try {
      setMatching(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const result = await matchJob(
        jobDescription,
        token
      );

      console.log("Job match result:", result);

      setMatchResult(result);

    } catch (err) {
      console.error("Job matching failed:", err);

      setError(
        err.message || "Failed to analyze job match."
      );
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="job-matcher-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <p className="page-eyebrow">
            JOB MATCHER
          </p>

          <h1>
            Find your role fit.
          </h1>

          <p className="page-subtitle">
            Compare your resume against a job description
            and discover exactly where you stand.
          </p>
        </div>

      </div>


      {/* JOB DESCRIPTION */}

      <section className="job-input-card">

        <div className="job-input-header">

          <div className="job-input-icon">
            <BriefcaseBusiness size={18} />
          </div>

          <div>
            <h3>
              Job Description
            </h3>

            <p>
              Paste the job description you want to analyze.
            </p>
          </div>

        </div>


        <textarea
          className="job-description-input"
          placeholder="Paste the complete job description here..."
          value={jobDescription}
          onChange={(event) =>
            setJobDescription(event.target.value)
          }
        />


        <div className="job-input-footer">

          <span>
            {jobDescription.length} characters
          </span>

          <button
            className="match-button"
            onClick={handleMatch}
            disabled={matching}
          >
            <Sparkles size={16} />

            {matching
              ? "Analyzing..."
              : "Analyze Job Match"}
          </button>

        </div>


        {error && (
          <div className="job-match-error">
            {error}
          </div>
        )}

      </section>


      {/* RESULTS */}

      {matchResult && (

        <div className="job-match-results">

          {/* MATCH SCORE */}

          <section className="match-score-card">

            <div>

              <p className="analysis-eyebrow">
                MATCH SCORE
              </p>

              <h2>
                {matchResult.matchScore}%
              </h2>

              <p>
                Overall compatibility with this role
              </p>

            </div>

            <div className="match-score-ring">
              <Sparkles size={24} />
            </div>

          </section>


          {/* SKILLS */}

          <section className="job-result-card">

            <div className="job-result-header">

              <div>
                <p className="analysis-eyebrow">
                  SKILL ALIGNMENT
                </p>

                <h3>
                  Matching Skills
                </h3>
              </div>

              <CheckCircle2 size={19} />

            </div>


            <div className="skill-tags">

              {(matchResult.matchingSkills || []).map(
                (skill, index) => (
                  <span key={index}>
                    {skill}
                  </span>
                )
              )}

            </div>

          </section>


          {/* MISSING SKILLS */}

          <section className="job-result-card">

            <div className="job-result-header">

              <div>
                <p className="analysis-eyebrow">
                  SKILL GAPS
                </p>

                <h3>
                  Missing Skills
                </h3>
              </div>

              <AlertTriangle size={19} />

            </div>


            <div className="missing-skills">

              {(matchResult.missingSkills || []).map(
                (skill, index) => (
                  <div key={index}>
                    <span>
                      {skill}
                    </span>

                    <ArrowUpRight size={15} />
                  </div>
                )
              )}

            </div>

          </section>


          {/* RECOMMENDATIONS */}

          <section className="recommendations-card">

            <div className="recommendations-header">

              <div className="recommendation-icon">
                <Sparkles size={18} />
              </div>

              <div>

                <p className="analysis-eyebrow">
                  AI INSIGHTS
                </p>

                <h3>
                  How to Improve Your Match
                </h3>

              </div>

            </div>


            <div className="recommendation-list">

              {(matchResult.recommendations || []).map(
                (recommendation, index) => (

                  <div
                    className="recommendation-item"
                    key={index}
                  >

                    <span className="recommendation-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>

                      <strong>
                        Recommendation {index + 1}
                      </strong>

                      <p>
                        {recommendation}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        </div>

      )}

    </div>
  );
}

export default JobMatcher;