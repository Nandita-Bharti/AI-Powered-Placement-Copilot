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
public class ResumeAnalysisResponse {

    private int atsScore;

    private List<String> skills;

    private List<String> strengths;

    private List<String> weaknesses;

    private List<String> missingSkills;

    private List<String> suggestions;
}