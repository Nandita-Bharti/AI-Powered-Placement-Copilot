package com.nandita.placement_copilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResultResponse {

    private Long interviewId;

    private String interviewType;

    private int totalQuestions;

    private int answeredQuestions;

    private int totalScore;

    private double averageScore;

    private String status;

    private List<String> recommendations;
}