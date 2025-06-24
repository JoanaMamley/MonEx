package com.monex.monex_backend.service;

import com.monex.monex_backend.dto.LoginResponse;
import com.monex.monex_backend.entity.User;
import com.monex.monex_backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public String signup(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already exists";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully";
    }


    public LoginResponse login(User loginRequest, HttpServletRequest request) {
        try {
            // Perform authentication
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            // Set the authentication object in the security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Create a new session or get the existing one
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            return new LoginResponse("Login successful", authentication.getName());

        } catch (Exception e) {
            return new LoginResponse("Invalid credentials");
        }
    }


    public Object getProfile(Principal principal) {
        if (principal == null) {
            return "No user logged in";
        }
        // Find the user by email (from the principal)
        Optional<User> userOptional = userRepository.findByEmail(principal.getName());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Create a Map to avoid sending the password hash
            Map<String, String> profile = new HashMap<>();
            profile.put("email", user.getEmail());
            return profile;
        }
        return "User not found";
    }

    public String logout(HttpServletRequest request) {
        // Invalidate the session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        // Clear the security context
        SecurityContextHolder.clearContext();
        return "Logout successful";
    }
}
