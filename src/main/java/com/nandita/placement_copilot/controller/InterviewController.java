package com.nandita.placement_copilot.controller;

import com.nandita.placement_copilot.dto.InterviewAnswerRequest;
import com.nandita.placement_copilot.dto.InterviewEvaluationResponse;
import com.nandita.placement_copilot.dto.InterviewQuestionResponse;
import com.nandita.placement_copilot.dto.InterviewStartRequest;
import com.nandita.placement_copilot.entity.User;
import com.nandita.placement_copilot.repository.UserRepository;
import com.nandita.placement_copilot.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final UserRepository userRepository;

    @PostMapping("/start")
    public ResponseEntity<InterviewQuestionResponse> startInterview(
            @RequestBody InterviewStartRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        InterviewQuestionResponse response =
                interviewService.startInterview(
                        user.getId(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/answer")
    public ResponseEntity<InterviewEvaluationResponse> submitAnswer(
            @RequestBody InterviewAnswerRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        InterviewEvaluationResponse response =
                interviewService.submitAnswer(
                        user.getId(),
                        request
                );

        return ResponseEntity.ok(response);
    }
}