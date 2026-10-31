
const API_BASE_URL = "http://localhost:8082";

async function request(endpoint, token, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed (${response.status})`);
  }

  return response.json();
}


export function startInterview(interviewType, topic, numberOfQuestions, token) {
  return request("/api/interview/start", token, {
    method: "POST",
    body: JSON.stringify({
      interviewType,
      topic,
      numberOfQuestions,
    }),
  });
}

export function submitInterviewAnswer(
  interviewId,
  questionNumber,
  answer,
  token
) {
  return request("/api/interview/answer", token, {
    method: "POST",
    body: JSON.stringify({ interviewId, questionNumber, answer }),
  });
}

export function getInterviewResult(interviewId, token) {
  return request(`/api/interview/${interviewId}/result`, token);
}

export function getInterviewHistory(token) {
  return request("/api/interview/history", token);
}
