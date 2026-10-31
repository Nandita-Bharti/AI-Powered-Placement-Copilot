package com.nandita.placement_copilot.controller;

import com.nandita.placement_copilot.entity.User;
import com.nandita.placement_copilot.repository.UserRepository;
import com.nandita.placement_copilot.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.nandita.placement_copilot.service.ResumeAnalysisService;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final UserRepository userRepository;
    private final ResumeAnalysisService resumeAnalysisService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        resumeService.uploadResume(user.getId(), file);

        return ResponseEntity.ok("Resume uploaded successfully");
    }
    @GetMapping("/analysis")
    public ResponseEntity<?> getSavedAnalysis(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                resumeAnalysisService.getSavedAnalysis(user.getId())
        );
    }
}