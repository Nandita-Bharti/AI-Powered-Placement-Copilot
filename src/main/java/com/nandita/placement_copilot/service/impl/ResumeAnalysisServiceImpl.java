package com.nandita.placement_copilot.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nandita.placement_copilot.dto.ResumeAnalysisResponse;
import com.nandita.placement_copilot.entity.Resume;
import com.nandita.placement_copilot.repository.ResumeRepository;
import com.nandita.placement_copilot.service.ResumeAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResumeAnalysisServiceImpl implements ResumeAnalysisService {

    private final ResumeRepository resumeRepository;
    private final ChatClient.Builder chatClientBuilder;

    @Override
    public ResumeAnalysisResponse analyzeResume(Long userId) {

        Resume resume = resumeRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.isBlank()) {
            throw new RuntimeException("Resume text is empty");
        }

        ChatClient chatClient = chatClientBuilder.build();

        String prompt = """
                You are an expert technical recruiter.
                
                Analyze the following resume for a student targeting
                Java Backend Developer roles.
                
                Resume:
                --------------------
                %s
                --------------------
                
                Return ONLY valid JSON.
                
                The JSON must follow exactly this structure:
                
                {
                  "atsScore": 0,
                  "skills": [],
                  "strengths": [],
                  "weaknesses": [],
                  "missingSkills": [],
                  "suggestions": []
                }
                
                Rules:
                
                - atsScore must be an integer from 0 to 100.
                - skills must contain only skills actually present in the resume.
                - strengths should contain concise observations.
                - weaknesses should contain genuine weaknesses.
                - missingSkills should contain relevant skills missing for a
                  Java Backend Developer role.
                - suggestions should be specific and actionable.
                - Do not invent experience, projects, education, or skills.
                - Return JSON only.
                - Do not use markdown code fences.
                """.formatted(resumeText);

        String response = chatClient
                .prompt(prompt)
                .call()
                .content();

        try {
            ObjectMapper objectMapper = new ObjectMapper();

            ResumeAnalysisResponse analysis =
                    objectMapper.readValue(response, ResumeAnalysisResponse.class);

            // Save the AI analysis in the existing Resume record
            resume.setAnalysisResult(objectMapper.writeValueAsString(analysis));
            resumeRepository.save(resume);

            return analysis;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse or save AI resume analysis", e);
        }
    }
    @Override
    public ResumeAnalysisResponse getSavedAnalysis(Long userId) {

        Resume resume = resumeRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (resume.getAnalysisResult() == null
                || resume.getAnalysisResult().isBlank()) {
            throw new RuntimeException("Resume analysis not found");
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();

            return objectMapper.readValue(
                    resume.getAnalysisResult(),
                    ResumeAnalysisResponse.class
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve saved resume analysis", e);
        }
    }
}