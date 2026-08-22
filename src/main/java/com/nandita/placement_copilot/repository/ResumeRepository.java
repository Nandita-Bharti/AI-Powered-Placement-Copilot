package com.nandita.placement_copilot.repository;

import com.nandita.placement_copilot.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    Optional<Resume> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}