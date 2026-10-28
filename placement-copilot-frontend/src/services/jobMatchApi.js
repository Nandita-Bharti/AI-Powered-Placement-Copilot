const API_BASE_URL = "http://localhost:8082";

export async function matchJob(jobDescription, token) {
  const response = await fetch(
    `${API_BASE_URL}/api/job-match`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        jobDescription,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || "Failed to analyze job match"
    );
  }

  return response.json();
}

export async function getJobMatchHistory(token) {
  const response = await fetch(
    `${API_BASE_URL}/api/job-match/history`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || "Failed to fetch job match history"
    );
  }

  return response.json();
}


export async function getLatestJobMatch(token) {
  const response = await fetch(
    `${API_BASE_URL}/api/job-match/latest`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // No job match has been saved yet
  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || "Failed to fetch latest job match"
    );
  }

  return response.json();
}
