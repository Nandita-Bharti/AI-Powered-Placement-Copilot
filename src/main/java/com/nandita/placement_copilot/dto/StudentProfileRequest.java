package com.nandita.placement_copilot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentProfileRequest {

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "College name is required")
    private String college;

    @NotBlank(message = "Degree is required")
    private String degree;

    @NotNull(message = "Graduation year is required")
    private Integer graduationYear;

    @NotBlank(message = "Target role is required")
    private String targetRole;

    private String skills;
}
