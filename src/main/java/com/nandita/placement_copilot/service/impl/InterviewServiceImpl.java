package com.nandita.placement_copilot.service.impl;

import com.nandita.placement_copilot.dto.InterviewHistoryResponse;
import com.nandita.placement_copilot.dto.*;
import com.nandita.placement_copilot.entity.Interview;
import com.nandita.placement_copilot.entity.InterviewStatus;
import com.nandita.placement_copilot.entity.User;
import com.nandita.placement_copilot.repository.InterviewQuestionRepository;
import com.nandita.placement_copilot.repository.InterviewRepository;
import com.nandita.placement_copilot.repository.UserRepository;
import com.nandita.placement_copilot.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.List;

import com.nandita.placement_copilot.entity.InterviewQuestion;

@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;
    private final ChatClient.Builder chatClientBuilder;
    private final InterviewQuestionRepository interviewQuestionRepository;

    @Override
    public InterviewQuestionResponse startInterview(
            Long userId,
            InterviewStartRequest request) {

        if (request.getInterviewType() == null ||
                request.getInterviewType().isBlank()) {

            throw new RuntimeException(
                    "Interview type is required"
            );
        }

        if (request.getNumberOfQuestions() <= 0) {

            throw new RuntimeException(
                    "Number of questions must be greater than 0"
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Interview interview = Interview.builder()
                .interviewType(request.getInterviewType())
                .totalQuestions(request.getNumberOfQuestions())
                .currentQuestion(1)
                .startedAt(LocalDateTime.now())
                .status(InterviewStatus.IN_PROGRESS)
                .user(user)
                .build();

        interview = interviewRepository.save(interview);

        String prompt = """
                You are an expert technical interviewer.

                Conduct a technical interview for a student.

                Interview Type:
                %s

                Total Questions:
                %d

                This is Question Number:
                1

                Generate ONE interview question.

                Rules:
                - Ask exactly one question.
                - Make it appropriate for a placement interview.
                - For JAVA_BACKEND, focus on Java, Spring Boot,
                  REST APIs, databases, Spring Security,
                  Hibernate/JPA, Docker or backend concepts.
                - For DSA, ask one DSA interview question.
                - Do not provide the answer.
                - Do not provide hints.
                - Return only the question text.
                """.formatted(
                request.getInterviewType(),
                request.getNumberOfQuestions()
        );

        ChatClient chatClient =
                chatClientBuilder.build();

        String question = chatClient
                .prompt(prompt)
                .call()
                .content();

        InterviewQuestion interviewQuestion =
                InterviewQuestion.builder()
                        .questionNumber(1)
                        .question(question)
                        .interview(interview)
                        .build();

        interviewQuestionRepository.save(interviewQuestion);
        return InterviewQuestionResponse.builder()
                .interviewId(interview.getId())
                .questionNumber(1)
                .question(question)
                .interviewType(request.getInterviewType())
                .build();
    }

    @Override
    public InterviewEvaluationResponse submitAnswer(
            Long userId,
            InterviewAnswerRequest request) {

        Interview interview = interviewRepository
                .findById(request.getInterviewId())
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        if (!interview.getUser().getId().equals(userId)) {
            throw new RuntimeException(
                    "You are not allowed to access this interview");
        }

        if (interview.getStatus() == InterviewStatus.COMPLETED) {
            throw new RuntimeException(
                    "Interview is already completed");
        }

        InterviewQuestion question =
                interviewQuestionRepository
                        .findByInterviewIdAndQuestionNumber(
                                request.getInterviewId(),
                                request.getQuestionNumber()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Interview question not found"));

        if (request.getAnswer() == null ||
                request.getAnswer().isBlank()) {

            throw new RuntimeException(
                    "Answer cannot be empty");
        }

        String prompt = """
            You are an expert technical interviewer.

            Evaluate the candidate's answer.

            Interview Type:
            %s

            Question:
            %s

            Candidate Answer:
            %s

            Evaluate the answer on a scale of 0 to 10.

            Consider:
            - Technical correctness
            - Understanding of the concept
            - Completeness
            - Clarity

            Return ONLY valid JSON using exactly:

            {
              "score": 0,
              "feedback": "",
              "nextQuestion": ""
            }

            Rules:
            - score must be between 0 and 10.
            - Give concise but useful feedback.
            - Generate one relevant next interview question.
            - Do not provide the answer to the next question.
            - Return JSON only.
            - Do not use markdown code fences.
            """.formatted(
                interview.getInterviewType(),
                question.getQuestion(),
                request.getAnswer()
        );

        ChatClient chatClient =
                chatClientBuilder.build();

        String response = chatClient
                .prompt(prompt)
                .call()
                .content();

        try {

            ObjectMapper objectMapper =
                    new ObjectMapper();

            EvaluationResult evaluation =
                    objectMapper.readValue(
                            response,
                            EvaluationResult.class
                    );

            question.setAnswer(request.getAnswer());
            question.setScore(evaluation.score());
            question.setFeedback(evaluation.feedback());

            interviewQuestionRepository.save(question);


            int nextQuestionNumber =
                    request.getQuestionNumber() + 1;

            if (nextQuestionNumber <= interview.getTotalQuestions()) {

                InterviewQuestion nextQuestion =
                        InterviewQuestion.builder()
                                .questionNumber(nextQuestionNumber)
                                .question(evaluation.nextQuestion())
                                .interview(interview)
                                .build();

                interviewQuestionRepository.save(nextQuestion);

                interview.setCurrentQuestion(
                        nextQuestionNumber
                );

                interviewRepository.save(interview);

            } else {

                interview.setStatus(
                        InterviewStatus.COMPLETED
                );

                interview.setCompletedAt(
                        java.time.LocalDateTime.now()
                );

                interviewRepository.save(interview);
            }

            return InterviewEvaluationResponse.builder()
                    .interviewId(interview.getId())
                    .questionNumber(
                            request.getQuestionNumber()
                    )
                    .score(evaluation.score())
                    .feedback(evaluation.feedback())
                    .nextQuestion(
                            nextQuestionNumber <= interview.getTotalQuestions()
                                    ? evaluation.nextQuestion()
                                    : null
                    )
                    .build();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to evaluate interview answer",
                    e
            );
        }
    }

    private record EvaluationResult(
            int score,
            String feedback,
            String nextQuestion
    ) {
    }

    @Override
    public InterviewResultResponse getInterviewResult(
            Long userId,
            Long interviewId) {

        Interview interview = interviewRepository
                .findById(interviewId)
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        if (!interview.getUser().getId().equals(userId)) {
            throw new RuntimeException(
                    "You are not allowed to access this interview");
        }

        var questions =
                interviewQuestionRepository
                        .findByInterviewIdOrderByQuestionNumberAsc(
                                interviewId
                        );

        int answeredQuestions = 0;
        int totalScore = 0;

        for (InterviewQuestion question : questions) {

            if (question.getScore() != null) {
                answeredQuestions++;
                totalScore += question.getScore();
            }
        }

        double averageScore = answeredQuestions == 0
                ? 0.0
                : (double) totalScore / answeredQuestions;

        StringBuilder interviewSummary = new StringBuilder();

        for (InterviewQuestion question : questions) {

            interviewSummary.append("""
            Question: %s
            Answer: %s
            Score: %d/10
            Feedback: %s

            """.formatted(
                    question.getQuestion(),
                    question.getAnswer(),
                    question.getScore(),
                    question.getFeedback()
            ));
        }

        String prompt = """
        You are an expert placement interview coach.

        Analyze the following technical interview performance.

        Interview Type:
        %s

        Average Score:
        %.2f / 10

        Interview Details:
        %s

        Provide exactly 3 personalized recommendations
        to help the candidate improve.

        Focus on:
        - Technical knowledge
        - Answer quality
        - Communication
        - Weak areas

        Return ONLY valid JSON:

        {
          "recommendations": [
            "recommendation 1",
            "recommendation 2",
            "recommendation 3"
          ]
        }

        Do not use markdown.
        """.formatted(
                interview.getInterviewType(),
                averageScore,
                interviewSummary
        );

        ChatClient chatClient =
                chatClientBuilder.build();

        String aiResponse = chatClient
                .prompt(prompt)
                .call()
                .content();

        ObjectMapper objectMapper =
                new ObjectMapper();

        RecommendationResult recommendationResult;

        try {

            recommendationResult =
                    objectMapper.readValue(
                            aiResponse,
                            RecommendationResult.class
                    );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate recommendations",
                    e
            );
        }

        return InterviewResultResponse.builder()
                .interviewId(interview.getId())
                .interviewType(interview.getInterviewType())
                .totalQuestions(interview.getTotalQuestions())
                .answeredQuestions(answeredQuestions)
                .totalScore(totalScore)
                .averageScore(
                        Math.round(averageScore * 100.0) / 100.0
                )
                .status(interview.getStatus().name())
                .recommendations(
                        recommendationResult.recommendations()
                )
                .build();
    }

    private record RecommendationResult(
            java.util.List<String> recommendations
    ) {
    }

    @Override
    public List<InterviewHistoryResponse> getInterviewHistory(Long userId) {

        List<Interview> interviews =
                interviewRepository
                        .findByUserIdOrderByStartedAtDesc(userId);

        return interviews.stream()
                .map(interview -> InterviewHistoryResponse.builder()
                        .id(interview.getId())
                        .interviewType(
                                interview.getInterviewType()
                        )
                        .totalQuestions(
                                interview.getTotalQuestions()
                        )
                        .currentQuestion(
                                interview.getCurrentQuestion()
                        )
                        .startedAt(
                                interview.getStartedAt()
                        )
                        .completedAt(
                                interview.getCompletedAt()
                        )
                        .status(
                                interview.getStatus().name()
                        )
                        .build())
                .toList();
    }
}