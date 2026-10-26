
const API_BASE_URL = "http://localhost:8082";

export async function generateStudyPlan(
  numberOfDays,
  hoursPerDay,
  token
) {
  const response = await fetch(
    `${API_BASE_URL}/api/study-plan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        numberOfDays,
        hoursPerDay,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || "Failed to generate study plan"
    );
  }

  return response.json();
}

export async function getStudyPlanHistory(token) {
  const response = await fetch(
    `${API_BASE_URL}/api/study-plan/history`,
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
      errorText || "Failed to fetch study plan history"
    );
  }

  return response.json();
}
