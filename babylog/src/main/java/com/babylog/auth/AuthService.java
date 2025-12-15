package com.babylog.auth;

import com.babylog.auth.dto.RegisterRequest;
import com.babylog.auth.dto.UserResponse;
import com.babylog.auth.dto.LoginRequest;
import com.babylog.auth.dto.AuthResponse;
public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);

}
