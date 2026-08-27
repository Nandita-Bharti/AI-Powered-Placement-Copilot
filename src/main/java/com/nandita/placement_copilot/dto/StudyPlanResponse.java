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
public class StudyPlanResponse {

    private String targetRole;

    private int totalDays;

    private List<StudyDay> days;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudyDay {

        private int day;

        private String topic;

        private List<String> tasks;

        private int estimatedHours;
    }
}