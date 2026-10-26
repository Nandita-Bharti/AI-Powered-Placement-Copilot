package com.nandita.placement_copilot.controller;

import com.nandita.placement_copilot.dto.LoginRequest;
import com.nandita.placement_copilot.dto.RegisterRequest;
import com.nandita.placement_copilot.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request) {

        String token = authService.register(request);

        return ResponseEntity.ok(token);
    }


    @PostMapping("/login")
    public ResponseEntity<String> login( @Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}