package com.nandita.placement_copilot.service.impl;

import com.nandita.placement_copilot.service.PdfTextExtractorService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Path;

@Service
public class PdfTextExtractorServiceImpl implements PdfTextExtractorService {

    @Override
    public String extractText(String filePath) throws IOException {

        String lowerCasePath = filePath.toLowerCase();

        if (lowerCasePath.endsWith(".pdf")) {
            return extractPdfText(filePath);
        }

        if (lowerCasePath.endsWith(".docx")) {
            return extractDocxText(filePath);
        }

        throw new IOException("Unsupported resume format");
    }

    private String extractPdfText(String filePath) throws IOException {

        try (PDDocument document =
                     Loader.loadPDF(Path.of(filePath).toFile())) {

            PDFTextStripper stripper = new PDFTextStripper();

            return stripper.getText(document);
        }
    }

    private String extractDocxText(String filePath) throws IOException {

        StringBuilder text = new StringBuilder();

        try (FileInputStream inputStream =
                     new FileInputStream(filePath);
             XWPFDocument document =
                     new XWPFDocument(inputStream)) {

            for (XWPFParagraph paragraph : document.getParagraphs()) {

                String paragraphText = paragraph.getText();

                if (paragraphText != null && !paragraphText.isBlank()) {
                    text.append(paragraphText)
                            .append(System.lineSeparator());
                }
            }
        }

        return text.toString();
    }
}