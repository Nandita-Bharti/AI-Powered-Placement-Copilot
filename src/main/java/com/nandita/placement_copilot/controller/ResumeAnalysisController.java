package com.nandita.placement_copilot.controller;

import com.nandita.placement_copilot.dto.ResumeAnalysisResponse;
import com.nandita.placement_copilot.entity.User;
import com.nandita.placement_copilot.repository.UserRepository;
import com.nandita.placement_copilot.service.ResumeAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeAnalysisController {

    private final ResumeAnalysisService resumeAnalysisService;
    private final UserRepository userRepository;

    @GetMapping("/analyze")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        ResumeAnalysisResponse analysis =
                resumeAnalysisService.analyzeResume(user.getId());

        return ResponseEntity.ok(analysis);
    }
}