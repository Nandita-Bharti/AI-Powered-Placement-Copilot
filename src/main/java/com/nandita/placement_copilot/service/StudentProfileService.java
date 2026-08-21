package com.nandita.placement_copilot.service;

import com.nandita.placement_copilot.dto.StudentProfileRequest;

public interface StudentProfileService {

    void createProfile(Long userId, StudentProfileRequest request);
}
