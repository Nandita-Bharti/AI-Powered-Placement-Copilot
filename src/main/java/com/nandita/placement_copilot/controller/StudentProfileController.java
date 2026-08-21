package com.nandita.placement_copilot.controller;

import com.nandita.placement_copilot.dto.StudentProfileRequest;
import com.nandita.placement_copilot.dto.StudentProfileResponse;
import com.nandita.placement_copilot.entity.User;
import com.nandita.placement_copilot.repository.UserRepository;
import com.nandita.placement_copilot.service.StudentProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class StudentProfileController {

    private final StudentProfileService studentProfileService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<String> createProfile(
            @Valid @RequestBody StudentProfileRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        studentProfileService.createProfile(user.getId(), request);

        return ResponseEntity.ok("Student profile created successfully");
    }

    @GetMapping
    public ResponseEntity<StudentProfileResponse> getProfile(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StudentProfileResponse profile =
                studentProfileService.getProfile(user.getId());

        return ResponseEntity.ok(profile);
    }
}