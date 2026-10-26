import { useRef, useState } from "react";
import "./ResumeAnalyzer.css";
import { uploadResume, analyzeResume } from "../services/resumeApi";
import { getToken } from "../services/authApi";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  X,
} from "lucide-react";

function ResumeAnalyzer() {

  const fileInputRef = useRef(null);

const [selectedFile, setSelectedFile] = useState(null);
const [analyzing, setAnalyzing] = useState(false);
const [analysisError, setAnalysisError] = useState("");
const [analysis, setAnalysis] = useState(null);


  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };


  const handleFileChange = (event) => {

    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
  };


  const removeFile = () => {

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
const handleAnalyze = async () => {
  if (!selectedFile) return;

  setAnalyzing(true);
  setAnalysisError("");

  try {
    const token = getToken();

    if (!token) {
      throw new Error("You are not logged in. Please login again.");
    }

    // 1. Upload resume
    await uploadResume(selectedFile, token);

    // 2. Ask backend to analyze it
    const result = await analyzeResume(token);

    console.log("Resume analysis:", result);
    setAnalysis(result);

    // Temporary: we'll connect this to the UI next
  } catch (error) {
    console.error("Resume analysis failed:", error);
    setAnalysisError(
      error.message || "Failed to analyze resume."
    );
  } finally {
    setAnalyzing(false);
  }
};

  return (
    <main className="resume-page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <section className="page-header">

        <div>

          <p className="page-eyebrow">
            AI POWERED
          </p>

          <h1>
            Resume Analyzer
          </h1>

          <p className="page-subtitle">
            Analyze your resume with AI and discover how to improve
            your chances of getting shortlisted.
          </p>

        </div>

        <div className="ai-badge">
          <Sparkles size={15} />
          Gemini AI
        </div>

      </section>


      {/* =====================================
          UPLOAD SECTION
      ====================================== */}

      <section className="resume-upload-card">

        <div className="upload-icon">
          <Upload size={25} />
        </div>

        <h2>
          Upload your resume
        </h2>

        <p>
          Upload your latest resume and let AI analyze your
          skills, ATS compatibility and improvement areas.
        </p>


        {/* Hidden file input */}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />


        {!selectedFile ? (

          <>

            <button
              className="upload-button"
              onClick={handleUploadClick}
            >
              <Upload size={17} />
              Upload Resume
            </button>

            <span className="upload-hint">
              PDF or DOCX · Maximum size 5MB
            </span>

          </>

) : (
        <div className="selected-file-wrapper">
          <div className="selected-file">
            <div className="selected-file-icon">
              <FileText size={18} />
            </div>

            <div className="selected-file-info">
              <strong>{selectedFile.name}</strong>

              <span>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>

            <button
              className="remove-file-button"
              onClick={removeFile}
              title="Remove file"
            >
              <X size={16} />
            </button>
          </div>

          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            <Sparkles size={17} />

            {analyzing ? "Analyzing..." : "Analyze Resume"}
          </button>

          {analysisError && (
            <div className="resume-analysis-error">
              {analysisError}
            </div>
          )}
        </div>
        )}
</section>


      {/* =====================================
          ANALYSIS PREVIEW
      ====================================== */}

      <section className="resume-analysis-grid">

        {/* ATS Score */}

        <div className="analysis-card ats-card">

          <div className="analysis-card-header">

            <div>

              <p className="analysis-eyebrow">
                ATS COMPATIBILITY
              </p>

              <h3>
                Resume Score
              </h3>

            </div>

            <FileText size={20} />

          </div>

          <div className="ats-score">
            <strong>{analysis ? analysis.atsScore : "--"}</strong>
            <span>/ 100</span>
          </div>

          <div className="analysis-progress">

            <div
              className="analysis-progress-fill"
              style={{ width: "82%" }}
            />

          </div>

          <p className="analysis-description">
            Your resume has strong ATS compatibility.
          </p>

        </div>


        {/* Skills */}

        <div className="analysis-card">

          <div className="analysis-card-header">

            <div>

              <p className="analysis-eyebrow">
                DETECTED
              </p>

              <h3>
                Skills
              </h3>

            </div>

            <CheckCircle2 size={20} />

          </div>

             <div className="skill-tags">
               {(analysis?.skills || []).map((skill, index) => (
                 <span key={index}>{skill}</span>
               ))}
             </div>

        </div>


        {/* Missing Skills */}

        <div className="analysis-card">

          <div className="analysis-card-header">

            <div>

              <p className="analysis-eyebrow">
                SKILL GAP
              </p>

              <h3>
                Missing Skills
              </h3>

            </div>

            <AlertTriangle size={20} />

          </div>

          <div className="missing-skills">

           {(analysis?.missingSkills || []).map((skill, index) => (
               <div key={index}>
                 <span>{skill}</span>
                 <ArrowUpRight size={15} />
               </div>
             ))}

          </div>

        </div>

      </section>


      {/* =====================================
          AI RECOMMENDATIONS
      ====================================== */}

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
              Resume Improvement Suggestions
            </h3>
          </div>

        </div>

        <div className="recommendation-list">

          {(analysis?.suggestions || []).map((suggestion, index) => (

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
                  {suggestion}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
}

export default ResumeAnalyzer;