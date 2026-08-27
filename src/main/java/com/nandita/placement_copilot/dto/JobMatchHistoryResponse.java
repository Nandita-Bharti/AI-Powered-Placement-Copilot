package com.nandita.placement_copilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobMatchHistoryResponse {

    private Long id;

    private String jobDescription;

    private int matchScore;

    private List<String> matchingSkills;

    private List<String> missingSkills;

    private List<String> recommendations;

    private LocalDateTime analyzedAt;
}