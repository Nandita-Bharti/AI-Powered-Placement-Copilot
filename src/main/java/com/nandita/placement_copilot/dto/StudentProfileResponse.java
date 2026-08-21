package com.nandita.placement_copilot.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentProfileResponse {

    private Long id;

    private String phone;

    private String college;

    private String degree;

    private Integer graduationYear;

    private String targetRole;

    private String skills;
}