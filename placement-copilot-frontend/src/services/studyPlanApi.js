
const API_BASE_URL = "http://localhost:8082";


export async function generateStudyPlan(request, token) {
  try {
    const response = await fetch(
      "http://localhost:8082/api/study-plan",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      }
    );

    const responseText = await response.text();

    console.log("Study Plan Status:", response.status);
    console.log("Study Plan Response:", responseText);

    if (!response.ok) {
      throw new Error(
        responseText || `Request failed with status ${response.status}`
      );
    }

    return responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.error("Study Plan API Error:", error);
    throw error;
  }
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
