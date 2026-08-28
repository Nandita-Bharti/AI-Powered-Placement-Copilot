package com.nandita.placement_copilot.service.impl;

import com.nandita.placement_copilot.dto.InterviewQuestionResponse;
import com.nandita.placement_copilot.dto.InterviewStartRequest;
import com.nandita.placement_copilot.entity.Interview;
import com.nandita.placement_copilot.entity.InterviewStatus;
import com.nandita.placement_copilot.entity.User;
import com.nandita.placement_copilot.repository.InterviewRepository;
import com.nandita.placement_copilot.repository.UserRepository;
import com.nandita.placement_copilot.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;
    private final ChatClient.Builder chatClientBuilder;

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

        return InterviewQuestionResponse.builder()
                .interviewId(interview.getId())
                .questionNumber(1)
                .question(question)
                .interviewType(request.getInterviewType())
                .build();
    }
}