package com.nandita.placement_copilot.service.impl;

import com.nandita.placement_copilot.entity.Resume;
import com.nandita.placement_copilot.entity.User;
import com.nandita.placement_copilot.repository.ResumeRepository;
import com.nandita.placement_copilot.repository.UserRepository;
import com.nandita.placement_copilot.service.PdfTextExtractorService;
import com.nandita.placement_copilot.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final PdfTextExtractorService pdfTextExtractorService;

    private final String uploadDirectory = "uploads/resumes";

    @Override
    public void uploadResume(Long userId, MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("Resume file is empty");
        }

        if (!"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new RuntimeException("Only PDF files are allowed");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        try {
            Path directory = Paths.get(uploadDirectory);

            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            String fileName = UUID.randomUUID()
                    + "_" + file.getOriginalFilename();

            Path filePath = directory.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

            String extractedText = pdfTextExtractorService
                    .extractText(filePath.toString());

            Resume existingResume = resumeRepository
                    .findByUserId(userId)
                    .orElse(null);

            if (existingResume != null) {

                try {
                    Files.deleteIfExists(
                            Paths.get(existingResume.getFilePath())
                    );
                } catch (IOException e) {
                    throw new RuntimeException("Failed to delete old resume", e);
                }

                existingResume.setFileName(file.getOriginalFilename());
                existingResume.setFilePath(filePath.toString());
                existingResume.setExtractedText(extractedText);
                existingResume.setUploadedAt(LocalDateTime.now());

                resumeRepository.save(existingResume);

            } else {

                Resume resume = Resume.builder()
                        .fileName(file.getOriginalFilename())
                        .filePath(filePath.toString())
                        .extractedText(extractedText)
                        .uploadedAt(LocalDateTime.now())
                        .user(user)
                        .build();

                resumeRepository.save(resume);
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to store resume", e);
        }
    }
}