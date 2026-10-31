package com.nandita.placement_copilot.service;

import com.nandita.placement_copilot.dto.ResumeAnalysisResponse;

public interface ResumeAnalysisService {

    ResumeAnalysisResponse analyzeResume(Long userId);
    ResumeAnalysisResponse getSavedAnalysis(Long userId);
}