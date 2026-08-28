package com.nandita.placement_copilot.controller;

import com.nandita.placement_copilot.dto.StudyPlanRequest;
import com.nandita.placement_copilot.dto.StudyPlanResponse;
import com.nandita.placement_copilot.entity.User;
import com.nandita.placement_copilot.repository.UserRepository;
import com.nandita.placement_copilot.service.StudyPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-plan")
@RequiredArgsConstructor
public class StudyPlanController {

    private final StudyPlanService studyPlanService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<StudyPlanResponse> generateStudyPlan(
            @RequestBody StudyPlanRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        StudyPlanResponse response =
                studyPlanService.generateStudyPlan(
                        user.getId(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<StudyPlanResponse>> getStudyPlanHistory(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<StudyPlanResponse> history =
                studyPlanService.getStudyPlanHistory(
                        user.getId()
                );

        return ResponseEntity.ok(history);
    }
}