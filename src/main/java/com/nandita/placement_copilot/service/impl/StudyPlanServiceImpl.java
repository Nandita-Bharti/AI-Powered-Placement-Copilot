package com.nandita.placement_copilot.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nandita.placement_copilot.dto.StudyPlanRequest;
import com.nandita.placement_copilot.dto.StudyPlanResponse;
import com.nandita.placement_copilot.entity.JobMatchHistory;
import com.nandita.placement_copilot.entity.StudentProfile;
import com.nandita.placement_copilot.repository.JobMatchHistoryRepository;
import com.nandita.placement_copilot.repository.StudentProfileRepository;
import com.nandita.placement_copilot.service.StudyPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import com.nandita.placement_copilot.entity.StudyPlan;
import com.nandita.placement_copilot.repository.StudyPlanRepository;
import java.time.LocalDateTime;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyPlanServiceImpl implements StudyPlanService {

    private final StudentProfileRepository studentProfileRepository;
    private final JobMatchHistoryRepository jobMatchHistoryRepository;
    private final ChatClient.Builder chatClientBuilder;
    private final StudyPlanRepository studyPlanRepository;

    @Override
    public StudyPlanResponse generateStudyPlan(
            Long userId,
            StudyPlanRequest request) {

        StudentProfile profile =
                studentProfileRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student profile not found"));

        if (request.getNumberOfDays() <= 0) {
            throw new RuntimeException(
                    "Number of days must be greater than 0");
        }
        if (request.getTopic() == null || request.getTopic().isBlank()) {
            throw new RuntimeException("Please enter a topic to study");
        }

        String topic = request.getTopic().trim();

        if (request.getHoursPerDay() <= 0) {
            throw new RuntimeException(
                    "Hours per day must be greater than 0");
        }

        List<JobMatchHistory> history =
                jobMatchHistoryRepository
                        .findByUserIdOrderByAnalyzedAtDesc(userId);

        String missingSkills = history.stream()
                .limit(5)
                .map(JobMatchHistory::getMissingSkills)
                .filter(skills ->
                        skills != null && !skills.isBlank())
                .reduce("", (a, b) -> a + "\n" + b);

        String prompt = """
        You are an expert tutor and learning-plan designer.

        Create a personalized study plan for the following topic:
        %s

        The student wants to learn this topic, not necessarily prepare
        for a particular job role.

        STUDENT'S EXISTING SKILLS (use only if relevant):
        %s

        NUMBER OF DAYS:
        %d

        HOURS AVAILABLE PER DAY:
        %d

        Return ONLY valid JSON using exactly this structure:
        {
          "targetRole": "",
          "totalDays": 0,
          "days": [
            {
              "day": 1,
              "topic": "",
              "tasks": [],
              "estimatedHours": 0
            }
          ]
        }

        Rules:
        - Set targetRole to the requested learning topic: %s.
        - Create exactly %d days.
        - Each day's estimatedHours must be at most %d.
        - Organize topics from foundational concepts to advanced concepts.
        - Include practical exercises and projects where appropriate.
        - Include revision and a final assessment near the end.
        - Keep tasks realistic for the available study time.
        - Make every day's topics relevant to the requested topic.
        - Return JSON only, without Markdown code fences.
        """.formatted(
                topic,
                profile.getSkills() == null ? "Not provided" : profile.getSkills(),
                request.getNumberOfDays(),
                request.getHoursPerDay(),
                topic,
                request.getNumberOfDays(),
                request.getHoursPerDay()
        );

        ChatClient chatClient = chatClientBuilder.build();

        String response = chatClient
                .prompt(prompt)
                .call()
                .content();

        try {

            ObjectMapper objectMapper = new ObjectMapper();

            StudyPlanResponse studyPlanResponse =
                    objectMapper.readValue(
                            response,
                            StudyPlanResponse.class
                    );

            StudyPlan studyPlan = StudyPlan.builder()
                    .planData(
                            objectMapper.writeValueAsString(
                                    studyPlanResponse
                            )
                    )
                    .targetRole(
                            studyPlanResponse.getTargetRole()
                    )
                    .totalDays(
                            studyPlanResponse.getTotalDays()
                    )
                    .createdAt(
                            LocalDateTime.now()
                    )
                    .user(
                            profile.getUser()
                    )
                    .build();

            studyPlanRepository.save(studyPlan);

            return studyPlanResponse;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse AI study plan",
                    e
            );
        }
    }

    @Override
    public List<StudyPlanResponse> getStudyPlanHistory(Long userId) {

        List<StudyPlan> plans =
                studyPlanRepository
                        .findByUserIdOrderByCreatedAtDesc(userId);

        ObjectMapper objectMapper = new ObjectMapper();

        return plans.stream()
                .map(plan -> {

                    try {

                        return objectMapper.readValue(
                                plan.getPlanData(),
                                StudyPlanResponse.class
                        );

                    } catch (Exception e) {

                        throw new RuntimeException(
                                "Failed to parse study plan history",
                                e
                        );
                    }
                })
                .toList();
    }
}