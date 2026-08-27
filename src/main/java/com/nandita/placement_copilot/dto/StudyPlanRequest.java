package com.nandita.placement_copilot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyPlanRequest {

    private int numberOfDays;

    private int hoursPerDay;
}