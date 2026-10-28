
import { useState } from "react";
import {
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LoaderCircle,
  MessageSquare,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  History,
  AlertCircle,
} from "lucide-react";

import { getToken } from "../services/authApi";
import {
  startInterview,
  submitInterviewAnswer,
  getInterviewResult,
  getInterviewHistory,
} from "../services/interviewApi";
import "./Interview.css";

function Interview() {
  const [interviewType, setInterviewType] = useState("JAVA_BACKEND");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  const [interview, setInterview] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const getAuthToken = () => {
    const token = getToken();

    if (!token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    return token;
  };

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      setError("");
      setInterview(null);
      setResult(null);
      setEvaluation(null);
      setAnswer("");

      const token = getAuthToken();

      const data = await startInterview(
        interviewType,
        numberOfQuestions,
        token
      );

      setInterview(data);
      setQuestion(data.question);
      setQuestionNumber(data.questionNumber || 1);
    } catch (err) {
      setError(err.message || "Could not start the interview.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please write your answer before submitting.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setEvaluation(null);

      const token = getAuthToken();

      const data = await submitInterviewAnswer(
        interview.interviewId,
        questionNumber,
        answer.trim(),
        token
      );

      setEvaluation(data);
      setAnswer("");

      if (data.nextQuestion) {
        setQuestion(data.nextQuestion);
        setQuestionNumber(questionNumber + 1);
      } else {
        const finalResult = await getInterviewResult(
          interview.interviewId,
          token
        );

        setResult(finalResult);
        setInterview(null);
      }
    } catch (err) {
      setError(err.message || "Could not submit your answer.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadHistory = async () => {
    try {
      setHistoryLoading(true);
      setError("");

      const token = getAuthToken();
      const data = await getInterviewHistory(token);

      setHistory(Array.isArray(data) ? data : []);
      setHistoryLoaded(true);
    } catch (err) {
      setError(err.message || "Could not load interview history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleViewResult = async (interviewId) => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();
      const data = await getInterviewResult(interviewId, token);

      setResult(data);
      setInterview(null);
      setEvaluation(null);
    } catch (err) {
      setError(err.message || "Could not load interview results.");
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setInterview(null);
    setQuestion("");
    setAnswer("");
    setEvaluation(null);
    setResult(null);
    setQuestionNumber(1);
    setError("");
  };

  const progress = interview
    ? Math.min(
        100,
        ((questionNumber - 1) / numberOfQuestions) * 100
      )
    : 0;

  return (
    <div className="interview-page">
      <header className="interview-page-header">
        <div>
          <p className="interview-eyebrow">AI INTERVIEW STUDIO</p>
          <h1>Practice with purpose.</h1>
          <p className="interview-subtitle">
            Build confidence, sharpen your answers, and prepare for your
            next placement interview.
          </p>
        </div>

        <div className="interview-header-icon">
          <Brain size={28} />
        </div>
      </header>

      {error && (
        <div className="interview-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!interview && !result && (
        <section className="interview-setup-card">
          <div className="interview-section-heading">
            <div className="interview-icon-box">
              <Sparkles size={20} />
            </div>
            <div>
              <h2>Configure your session</h2>
              <p>Choose the format that matches your preparation goals.</p>
            </div>
          </div>

          <div className="interview-type-grid">
            <button
              type="button"
              className={`interview-type-card ${
                interviewType === "JAVA_BACKEND" ? "selected" : ""
              }`}
              onClick={() => setInterviewType("JAVA_BACKEND")}
            >
              <BriefcaseBusiness size={22} />
              <strong>Java Backend</strong>
              <span>Java, Spring Boot, REST APIs and databases</span>
            </button>

            <button
              type="button"
              className={`interview-type-card ${
                interviewType === "DSA" ? "selected" : ""
              }`}
              onClick={() => setInterviewType("DSA")}
            >
              <Target size={22} />
              <strong>DSA Practice</strong>
              <span>Problem-solving and data structures</span>
            </button>

            <button
              type="button"
              className={`interview-type-card ${
                interviewType === "HR" ? "selected" : ""
              }`}
              onClick={() => setInterviewType("HR")}
            >
              <MessageSquare size={22} />
              <strong>HR Interview</strong>
              <span>Communication, motivation and behavioral questions</span>
            </button>
          </div>

          <div className="interview-config-field">
            <label htmlFor="interview-question-count">
              Number of questions
            </label>

            <select
              id="interview-question-count"
              value={numberOfQuestions}
              onChange={(event) =>
                setNumberOfQuestions(Number(event.target.value))
              }
            >
              <option value={3}>3 questions · Quick practice</option>
              <option value={5}>5 questions · Standard session</option>
              <option value={10}>10 questions · Full practice</option>
            </select>
          </div>

          <button
            type="button"
            className="interview-primary-button"
            onClick={handleStartInterview}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="interview-spinner" size={18} />
            ) : (
              <Sparkles size={18} />
            )}
            {loading ? "Preparing interview..." : "Start Interview"}
            {!loading && <ChevronRight size={18} />}
          </button>
        </section>
      )}

      {interview && (
        <section className="active-interview-card">
          <div className="active-interview-top">
            <div>
              <p className="interview-eyebrow">YOUR LIVE SESSION</p>
              <h2>
                {interviewType === "JAVA_BACKEND"
                  ? "Java Backend Interview"
                  : interviewType === "DSA"
                    ? "DSA Interview"
                    : "HR Interview"}
              </h2>
            </div>

            <span className="interview-live-badge">In progress</span>
          </div>

          <div className="interview-progress-info">
            <span>
              Question {questionNumber} of {numberOfQuestions}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>

          <div className="interview-progress-track">
            <div
              className="interview-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="interview-question-box">
            <span className="interview-question-label">
              QUESTION {questionNumber}
            </span>
            <h3>{question}</h3>
          </div>

          {evaluation && (
            <div className="interview-feedback-card">
              <div className="interview-feedback-heading">
                <CheckCircle2 size={19} />
                <strong>AI feedback</strong>
                <span>{evaluation.score}/10</span>
              </div>
              <p>{evaluation.feedback}</p>
            </div>
          )}

          <div className="interview-answer-field">
            <label htmlFor="interview-answer">Your answer</label>
            <textarea
              id="interview-answer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Explain your approach clearly. Include examples where relevant..."
              rows={7}
              disabled={loading}
            />
            <span className="interview-answer-hint">
              Aim for a clear, structured answer with relevant examples.
            </span>
          </div>

          <div className="interview-action-row">
            <button
              type="button"
              className="interview-secondary-button"
              onClick={resetInterview}
              disabled={loading}
            >
              End session
            </button>

            <button
              type="button"
              className="interview-primary-button"
              onClick={handleSubmitAnswer}
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="interview-spinner" size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
              {loading ? "Evaluating..." : "Submit Answer"}
            </button>
          </div>
        </section>
      )}

      {result && (
        <section className="interview-result-card">
          <div className="interview-result-icon">
            <Trophy size={30} />
          </div>

          <p className="interview-eyebrow">SESSION COMPLETED</p>
          <h2>Your interview results</h2>
          <p className="interview-subtitle">
            Review your performance and use the recommendations to improve.
          </p>

          <div className="interview-result-stats">
            <div>
              <span>Average score</span>
              <strong>{result.averageScore}/10</strong>
            </div>
            <div>
              <span>Answered</span>
              <strong>
                {result.answeredQuestions}/{result.totalQuestions}
              </strong>
            </div>
            <div>
              <span>Total points</span>
              <strong>{result.totalScore}</strong>
            </div>
          </div>

          <div className="interview-recommendations">
            <h3>Recommended next steps</h3>
            {(result.recommendations || []).map((item, index) => (
              <div className="interview-recommendation" key={index}>
                <CheckCircle2 size={17} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="interview-primary-button"
            onClick={resetInterview}
          >
            <RotateCcw size={18} />
            Start another interview
          </button>
        </section>
      )}

      <section className="interview-history-section">
        <div className="interview-history-header">
          <div>
            <p className="interview-eyebrow">YOUR PROGRESS</p>
            <h2>Previous interviews</h2>
            <p className="interview-subtitle">
              Revisit earlier sessions and their results.
            </p>
          </div>

          <button
            type="button"
            className="interview-secondary-button"
            onClick={handleLoadHistory}
            disabled={historyLoading}
          >
            {historyLoading ? (
              <LoaderCircle className="interview-spinner" size={17} />
            ) : (
              <History size={17} />
            )}
            {historyLoading ? "Loading..." : "Load history"}
          </button>
        </div>

        {historyLoaded && (
          history.length > 0 ? (
            <div className="interview-history-list">
              {history.map((item) => (
                <article className="interview-history-item" key={item.id}>
                  <div className="interview-history-icon">
                    <Clock3 size={20} />
                  </div>

                  <div className="interview-history-details">
                    <strong>{item.interviewType.replaceAll("_", " ")}</strong>
                    <span>
                      {item.currentQuestion} of {item.totalQuestions} questions
                      {" · "}
                      {item.startedAt
                        ? new Date(item.startedAt).toLocaleDateString()
                        : "Date unavailable"}
                    </span>
                    <span className="interview-status-text">
                      {item.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="interview-view-button"
                    onClick={() => handleViewResult(item.id)}
                    disabled={loading || item.status !== "COMPLETED"}
                    title={
                      item.status === "COMPLETED"
                        ? "View results"
                        : "Complete this interview to view results"
                    }
                  >
                    View results
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <p className="interview-empty-state">
              No interviews found yet. Start your first practice session above.
            </p>
          )
        )}
      </section>
    </div>
  );
}

export default Interview;
