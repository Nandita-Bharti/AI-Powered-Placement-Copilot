package com.nandita.placement_copilot.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String interviewType;

    private int totalQuestions;

    private int currentQuestion;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @Enumerated(EnumType.STRING)
    private InterviewStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}