package com.babylog.auth;

import com.babylog.auth.dto.AuthResponse;
import com.babylog.auth.dto.LoginRequest;
import com.babylog.auth.dto.RegisterRequest;
import com.babylog.auth.dto.UserResponse;
import com.babylog.entity.User;
import com.babylog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    @Override
    public UserResponse register(RegisterRequest request) {

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        User saved = userRepository.save(user);

        return new UserResponse(saved.getId(), saved.getEmail(), saved.getCreatedAt());
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        var user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        boolean ok = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!ok) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getId());
        return new AuthResponse(token);
    }

}
