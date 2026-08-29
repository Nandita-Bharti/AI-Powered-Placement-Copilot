package com.nandita.placement_copilot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewAnswerRequest {

    private Long interviewId;

    private int questionNumber;

    private String answer;
}