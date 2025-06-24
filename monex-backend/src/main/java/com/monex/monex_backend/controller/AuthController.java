package com.monex.monex_backend.controller;

import com.monex.monex_backend.dto.LoginResponse;
import com.monex.monex_backend.entity.User;
import com.monex.monex_backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://34.55.103.66:4200", allowCredentials = "true")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        String result = authService.signup(user);
        if (result.equals("Email already exists")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(result);
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest, HttpServletRequest request) {
        LoginResponse response = authService.login(loginRequest, request);
        if (response.getEmail() != null){
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    // Endpoint to get the current user's profile information
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        Object response = authService.getProfile(principal);
        if (response instanceof String) {
            if (response.equals("No user logged in")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No user logged in");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } else {
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String response = authService.logout(request);
        return ResponseEntity.ok(response);
    }
}
