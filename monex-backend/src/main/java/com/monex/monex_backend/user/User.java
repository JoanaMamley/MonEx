package com.monex.monex_backend.user;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users") // Explicitly name the table 'users'
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
}
