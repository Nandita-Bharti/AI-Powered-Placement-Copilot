
package com.nandita.placement_copilot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewStartRequest {

    private String interviewType;

    private String topic;

    private int numberOfQuestions;
}
