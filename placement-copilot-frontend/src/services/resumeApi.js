const API_BASE_URL = "http://localhost:8082";

export async function uploadResume(file, token) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/resume/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to upload resume");
  }

  return response.text();
}

export async function analyzeResume(token) {
  const response = await fetch(
    `${API_BASE_URL}/api/resume/analyze`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to analyze resume");
  }

  return response.json();
}
export async function getSavedAnalysis(token) {
  const response = await fetch(`${API_BASE_URL}/api/resume/analysis`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch saved resume analysis");
  }

  return response.json();
}