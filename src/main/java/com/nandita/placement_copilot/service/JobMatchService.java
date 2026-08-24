package com.nandita.placement_copilot.service;

import com.nandita.placement_copilot.dto.JobMatchRequest;
import com.nandita.placement_copilot.dto.JobMatchResponse;

public interface JobMatchService {

    JobMatchResponse matchResumeWithJob(
            Long userId,
            JobMatchRequest request
    );
}