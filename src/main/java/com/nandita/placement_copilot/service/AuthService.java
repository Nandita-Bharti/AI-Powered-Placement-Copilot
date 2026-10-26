
package com.nandita.placement_copilot.service;

import com.nandita.placement_copilot.dto.LoginRequest;
import com.nandita.placement_copilot.dto.RegisterRequest;

public interface AuthService {
    String register(RegisterRequest request);

    String login(LoginRequest request);
}
