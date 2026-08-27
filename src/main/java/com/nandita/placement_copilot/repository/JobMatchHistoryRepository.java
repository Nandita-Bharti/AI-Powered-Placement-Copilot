package com.nandita.placement_copilot.repository;

import com.nandita.placement_copilot.entity.JobMatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobMatchHistoryRepository
        extends JpaRepository<JobMatchHistory, Long> {

    List<JobMatchHistory> findByUserIdOrderByAnalyzedAtDesc(Long userId);
}