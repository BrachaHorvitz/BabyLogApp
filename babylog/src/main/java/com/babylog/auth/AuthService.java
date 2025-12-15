package com.babylog.auth;

import com.babylog.auth.dto.RegisterRequest;
import com.babylog.auth.dto.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
}
