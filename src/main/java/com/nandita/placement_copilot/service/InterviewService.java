package com.nandita.placement_copilot.service;

import com.nandita.placement_copilot.dto.*;

public interface InterviewService {

    InterviewQuestionResponse startInterview(
            Long userId,
            InterviewStartRequest request
    );
    InterviewEvaluationResponse submitAnswer(
            Long userId,
            InterviewAnswerRequest request
    );

    InterviewResultResponse getInterviewResult(
            Long userId,
            Long interviewId
    );
}