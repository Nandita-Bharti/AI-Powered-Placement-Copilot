const API_BASE_URL = "http://localhost:8082";

async function profileRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Profile request failed");
  }

  if (response.status === 204) return null;

      const text = await response.text();

      if (!text) return null;

      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
}

export function createUserProfile(profile) {
  return profileRequest("/api/profile", {
    method: "POST",
    body: JSON.stringify(profile),
  });
}

export function getUserProfile() {
  return profileRequest("/api/profile");
}
