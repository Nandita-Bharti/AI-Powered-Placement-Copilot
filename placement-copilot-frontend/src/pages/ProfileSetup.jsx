
import { useState } from "react";
import { createUserProfile } from "../services/profileApi";
import "./ProfileSetup.css";

function ProfileSetup({ onComplete }) {
  const [form, setForm] = useState({
    phone: "",
    college: "",
    degree: "B.Tech CSE",
    graduationYear: "2027",
    targetRole: "Java Backend Developer",
    skills: "Java, Spring Boot, PostgreSQL, DSA",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createUserProfile({
        ...form,
        graduationYear: Number(form.graduationYear),
      });
      onComplete();
    } catch (err) {
      setError(err.message || "Could not save your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="profile-setup-page">
      <form className="profile-setup-card" onSubmit={handleSubmit}>
        <p className="profile-eyebrow">ONE LAST STEP</p>
        <h1>Complete your profile</h1>
        <p className="profile-description">
          Tell us about your education and career goals to personalize
          your placement preparation.
        </p>

        <div className="profile-form-grid">
          <label>
            Phone number
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </label>

          <label>
            College name
            <input
              name="college"
              value={form.college}
              onChange={handleChange}
              placeholder="Enter college name"
              required
            />
          </label>

          <label>
            Degree / Branch
            <input
              name="degree"
              value={form.degree}
              onChange={handleChange}
              placeholder="e.g. B.Tech CSE"
              required
            />
          </label>

          <label>
            Graduation year
            <input
              name="graduationYear"
              type="number"
              min="2000"
              max="2100"
              value={form.graduationYear}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Target role
            <input
              name="targetRole"
              value={form.targetRole}
              onChange={handleChange}
              placeholder="e.g. Java Backend Developer"
              required
            />
          </label>

          <label>
            Skills (comma-separated)
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Java, Spring Boot, DSA"
              required
            />
          </label>
        </div>

        {error && <p className="profile-form-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving profile..." : "Save profile & continue"}
        </button>
      </form>
    </main>
  );
}

export default ProfileSetup;
