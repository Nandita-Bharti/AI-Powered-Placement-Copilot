package com.nandita.placement_copilot.service;

import com.nandita.placement_copilot.dto.StudyPlanRequest;
import com.nandita.placement_copilot.dto.StudyPlanResponse;

public interface StudyPlanService {

    StudyPlanResponse generateStudyPlan(
            Long userId,
            StudyPlanRequest request
    );
}