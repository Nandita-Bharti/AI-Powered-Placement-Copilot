package com.nandita.placement_copilot.repository;

import com.nandita.placement_copilot.entity.Interview;
import com.nandita.placement_copilot.entity.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository
        extends JpaRepository<Interview, Long> {

    List<Interview> findByUserIdOrderByStartedAtDesc(Long userId);

    List<Interview> findByUserIdAndStatus(
            Long userId,
            InterviewStatus status
    );
}