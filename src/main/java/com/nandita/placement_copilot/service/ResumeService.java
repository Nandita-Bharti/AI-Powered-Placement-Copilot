package com.nandita.placement_copilot.service;

import org.springframework.web.multipart.MultipartFile;

public interface ResumeService {

    void uploadResume(Long userId, MultipartFile file);
}