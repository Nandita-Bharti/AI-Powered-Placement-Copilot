package com.nandita.placement_copilot.service;

import com.nandita.placement_copilot.dto.StudentProfileRequest;
import com.nandita.placement_copilot.dto.StudentProfileResponse;

public interface StudentProfileService {

    void createProfile(Long userId, StudentProfileRequest request);
    StudentProfileResponse getProfile(Long userId);
}
