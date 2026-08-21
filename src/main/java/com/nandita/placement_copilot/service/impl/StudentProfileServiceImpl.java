package com.nandita.placement_copilot.service.impl;

import com.nandita.placement_copilot.dto.StudentProfileRequest;
import com.nandita.placement_copilot.dto.StudentProfileResponse;
import com.nandita.placement_copilot.entity.StudentProfile;
import com.nandita.placement_copilot.entity.User;
import com.nandita.placement_copilot.repository.StudentProfileRepository;
import com.nandita.placement_copilot.repository.UserRepository;
import com.nandita.placement_copilot.service.StudentProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentProfileServiceImpl implements StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;

    @Override
    public void createProfile(
            Long userId,
            StudentProfileRequest request) {

        if (studentProfileRepository.existsByUserId(userId)) {
            throw new RuntimeException("Profile already exists");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        StudentProfile profile = StudentProfile.builder()
                .phone(request.getPhone())
                .college(request.getCollege())
                .degree(request.getDegree())
                .graduationYear(request.getGraduationYear())
                .targetRole(request.getTargetRole())
                .skills(request.getSkills())
                .user(user)
                .build();

        studentProfileRepository.save(profile);
    }
    @Override
    public StudentProfileResponse getProfile(Long userId) {

        StudentProfile profile = studentProfileRepository
                .findByUserId(userId)
                .orElseThrow(() ->
                        new RuntimeException("Student profile not found"));

        return StudentProfileResponse.builder()
                .id(profile.getId())
                .phone(profile.getPhone())
                .college(profile.getCollege())
                .degree(profile.getDegree())
                .graduationYear(profile.getGraduationYear())
                .targetRole(profile.getTargetRole())
                .skills(profile.getSkills())
                .build();
    }
}
