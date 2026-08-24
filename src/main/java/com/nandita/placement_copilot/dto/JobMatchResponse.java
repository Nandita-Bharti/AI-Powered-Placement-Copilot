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
public class JobMatchResponse {

    private int matchScore;

    private List<String> matchingSkills;

    private List<String> missingSkills;

    private List<String> recommendations;
}