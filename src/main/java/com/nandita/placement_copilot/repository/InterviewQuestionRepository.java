package com.nandita.placement_copilot.repository;

import com.nandita.placement_copilot.entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewQuestionRepository
        extends JpaRepository<InterviewQuestion, Long> {

    List<InterviewQuestion> findByInterviewIdOrderByQuestionNumberAsc(
            Long interviewId
    );

    Optional<InterviewQuestion> findByInterviewIdAndQuestionNumber(
            Long interviewId,
            int questionNumber
    );
}