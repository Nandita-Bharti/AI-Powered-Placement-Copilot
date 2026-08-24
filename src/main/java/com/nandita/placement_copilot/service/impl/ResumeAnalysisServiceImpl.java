package com.nandita.placement_copilot.service.impl;

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
    public String analyzeResume(Long userId) {

        Resume resume = resumeRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Resume not found"));

        String resumeText = resume.getExtractedText();

        if (resumeText == null || resumeText.isBlank()) {
            throw new RuntimeException("Resume text is empty");
        }

        ChatClient chatClient = chatClientBuilder.build();

        String prompt = """
                You are an expert technical recruiter and resume reviewer.

                Analyze the following resume and provide useful feedback for
                a student targeting Java Backend Developer roles.

                Resume:
                --------------------
                %s
                --------------------

                Provide:
                1. Overall resume assessment
                2. Important technical skills found
                3. Strong points
                4. Weak points
                5. Missing skills that would improve the resume
                6. Specific improvement suggestions
                7. An estimated ATS score out of 100

                Be honest and practical. Do not invent experience or skills
                that are not present in the resume.
                """.formatted(resumeText);

        return chatClient
                .prompt(prompt)
                .call()
                .content();
    }
}