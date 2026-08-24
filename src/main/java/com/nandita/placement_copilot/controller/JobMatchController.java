package com.nandita.placement_copilot.controller;

import com.nandita.placement_copilot.dto.JobMatchRequest;
import com.nandita.placement_copilot.dto.JobMatchResponse;
import com.nandita.placement_copilot.entity.User;
import com.nandita.placement_copilot.repository.UserRepository;
import com.nandita.placement_copilot.service.JobMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/job-match")
@RequiredArgsConstructor
public class JobMatchController {

    private final JobMatchService jobMatchService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<JobMatchResponse> matchJob(
            @RequestBody JobMatchRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        JobMatchResponse response =
                jobMatchService.matchResumeWithJob(
                        user.getId(),
                        request
                );

        return ResponseEntity.ok(response);
    }
}