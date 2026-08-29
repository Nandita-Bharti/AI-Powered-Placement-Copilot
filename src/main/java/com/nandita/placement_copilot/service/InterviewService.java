package com.nandita.placement_copilot.service;

import com.nandita.placement_copilot.dto.InterviewAnswerRequest;
import com.nandita.placement_copilot.dto.InterviewEvaluationResponse;
import com.nandita.placement_copilot.dto.InterviewQuestionResponse;
import com.nandita.placement_copilot.dto.InterviewStartRequest;

public interface InterviewService {

    InterviewQuestionResponse startInterview(
            Long userId,
            InterviewStartRequest request
    );
    InterviewEvaluationResponse submitAnswer(
            Long userId,
            InterviewAnswerRequest request
    );
}