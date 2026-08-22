package com.nandita.placement_copilot.service.impl;

import com.nandita.placement_copilot.service.PdfTextExtractorService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Path;

@Service
public class PdfTextExtractorServiceImpl implements PdfTextExtractorService {

    @Override
    public String extractText(String filePath) throws IOException {

        try (PDDocument document = Loader.loadPDF(Path.of(filePath).toFile())) {

            PDFTextStripper stripper = new PDFTextStripper();

            return stripper.getText(document);
        }
    }
}