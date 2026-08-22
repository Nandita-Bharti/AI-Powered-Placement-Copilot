package com.nandita.placement_copilot.service;

import java.io.IOException;

public interface PdfTextExtractorService {

    String extractText(String filePath) throws IOException;
}