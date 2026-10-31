package com.nandita.placement_copilot.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nandita.placement_copilot.dto.JobMatchHistoryResponse;
import com.nandita.placement_copilot.dto.JobMatchRequest;
import com.nandita.placement_copilot.dto.JobMatchResponse;
import com.nandita.placement_copilot.entity.Resume;
import com.nandita.placement_copilot.repository.ResumeRepository;
import com.nandita.placement_copilot.service.JobMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.nandita.placement_copilot.entity.JobMatchHistory;
import com.nandita.placement_copilot.repository.JobMatchHistoryRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobMatchServiceImpl implements JobMatchService {

    private final ResumeRepository resumeRepository;
    private final JobMatchHistoryRepository jobMatchHistoryRepository;
    private final ChatClient.Builder chatClientBuilder;


    @Override
    public JobMatchResponse matchResumeWithJob(
            Long userId,
            JobMatchRequest request) {

        Resume resume = resumeRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.isBlank()) {
            throw new RuntimeException("Resume text is empty");
        }

        if (request.getJobDescription() == null ||
                request.getJobDescription().isBlank()) {

            throw new RuntimeException(
                    "Job description cannot be empty");
        }

        ChatClient chatClient = chatClientBuilder.build();

        String prompt = """
                You are an expert technical recruiter.

                Compare the student's resume with the provided
                job description.

                RESUME:
                --------------------
                %s
                --------------------

                JOB DESCRIPTION:
                --------------------
                %s
                --------------------

                Return ONLY valid JSON.

                Use exactly this structure:

                {
                  "matchScore": 0,
                  "matchingSkills": [],
                  "missingSkills": [],
                  "recommendations": []
                }

                Rules:

                - matchScore must be an integer from 0 to 100.
                - matchingSkills must contain skills present in both
                  the resume and job description.
                - missingSkills must contain relevant job requirements
                  that are missing from the resume.
                - recommendations must be practical and specific.
                - Do not invent skills or experience.
                - Return JSON only.
                - Do not use markdown code fences.
                """.formatted(
                resumeText,
                request.getJobDescription()
        );

        String response = chatClient
                .prompt(prompt)
                .call()
                .content();

        try {

            ObjectMapper objectMapper = new ObjectMapper();

            JobMatchResponse jobMatchResponse =
                    objectMapper.readValue(
                            response,
                            JobMatchResponse.class
                    );

            JobMatchHistory history = JobMatchHistory.builder()
                    .jobDescription(request.getJobDescription())
                    .matchScore(jobMatchResponse.getMatchScore())
                    .matchingSkills(
                            objectMapper.writeValueAsString(
                                    jobMatchResponse.getMatchingSkills()
                            )
                    )
                    .missingSkills(
                            objectMapper.writeValueAsString(
                                    jobMatchResponse.getMissingSkills()
                            )
                    )
                    .recommendations(
                            objectMapper.writeValueAsString(
                                    jobMatchResponse.getRecommendations()
                            )
                    )
                    .analyzedAt(LocalDateTime.now())
                    .user(resume.getUser())
                    .build();

            jobMatchHistoryRepository.save(history);

            return jobMatchResponse;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse AI job match response",
                    e
            );
        }
    }

    @Override
    public List<JobMatchHistoryResponse> getMatchHistory(Long userId) {

        List<JobMatchHistory> historyList =
                jobMatchHistoryRepository
                        .findByUserIdOrderByAnalyzedAtDesc(userId);

        ObjectMapper objectMapper = new ObjectMapper();

        return historyList.stream()
                .map(history -> {

                    try {

                        return JobMatchHistoryResponse.builder()
                                .id(history.getId())
                                .jobDescription(
                                        history.getJobDescription()
                                )
                                .matchScore(
                                        history.getMatchScore()
                                )
                                .matchingSkills(
                                        objectMapper.readValue(
                                                history.getMatchingSkills(),
                                                List.class
                                        )
                                )
                                .missingSkills(
                                        objectMapper.readValue(
                                                history.getMissingSkills(),
                                                List.class
                                        )
                                )
                                .recommendations(
                                        objectMapper.readValue(
                                                history.getRecommendations(),
                                                List.class
                                        )
                                )
                                .analyzedAt(
                                        history.getAnalyzedAt()
                                )
                                .build();

                    } catch (Exception e) {

                        throw new RuntimeException(
                                "Failed to parse match history",
                                e
                        );
                    }
                })
                .toList();
    }

    @Override
    public JobMatchHistoryResponse getLatestMatch(Long userId) {
        JobMatchHistory history = jobMatchHistoryRepository
                .findFirstByUserIdOrderByAnalyzedAtDesc(userId)
                .orElse(null);

        if (history == null) {
            return null;
        }

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            return JobMatchHistoryResponse.builder()
                    .id(history.getId())
                    .jobDescription(history.getJobDescription())
                    .matchScore(history.getMatchScore())
                    .matchingSkills(objectMapper.readValue(
                            history.getMatchingSkills(), List.class))
                    .missingSkills(objectMapper.readValue(
                            history.getMissingSkills(), List.class))
                    .recommendations(objectMapper.readValue(
                            history.getRecommendations(), List.class))
                    .analyzedAt(history.getAnalyzedAt())
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse latest job match", e);
        }
    }
}