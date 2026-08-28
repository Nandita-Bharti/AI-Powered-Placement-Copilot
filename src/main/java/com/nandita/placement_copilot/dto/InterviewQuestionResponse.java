package com.nandita.placement_copilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestionResponse {

    private Long interviewId;

    private int questionNumber;

    private String question;

    private String interviewType;
}