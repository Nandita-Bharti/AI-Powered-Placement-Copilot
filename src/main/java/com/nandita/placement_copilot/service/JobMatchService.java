package com.nandita.placement_copilot.service;

import com.nandita.placement_copilot.dto.JobMatchHistoryResponse;
import com.nandita.placement_copilot.dto.JobMatchRequest;
import com.nandita.placement_copilot.dto.JobMatchResponse;

import java.util.List;

public interface JobMatchService {

    JobMatchResponse matchResumeWithJob(
            Long userId,
            JobMatchRequest request
    );

    List<JobMatchHistoryResponse> getMatchHistory(
            Long userId
    );
    JobMatchHistoryResponse getLatestMatch(Long userId);
}