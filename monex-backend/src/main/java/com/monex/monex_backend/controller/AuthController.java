package com.monex.monex_backend.controller;

import com.monex.monex_backend.dto.AuthRequest;
import com.monex.monex_backend.entity.User;
import com.monex.monex_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest signUpRequest) {
        // Check if username is already taken
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }

        // Create new user's account
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword())); // Hash the password

        userRepository.save(user);

        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody AuthRequest loginRequest) {
        // Find user by username
        return userRepository.findByEmail(loginRequest.getEmail())
                .map(user -> {
                    // Check if the provided password matches the stored hashed password
                    if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                        return new ResponseEntity<>("Login successful", HttpStatus.OK);
                    }
                    // If password does not match
                    return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
                })
                // If user is not found
                .orElse(new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED));
    }
}
