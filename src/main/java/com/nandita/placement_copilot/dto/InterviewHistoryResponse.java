package com.nandita.placement_copilot.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InterviewHistoryResponse {

    private Long id;

    private String interviewType;

    private Integer totalQuestions;

    private Integer currentQuestion;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    private String status;
}