package com.cibertec.controller;

import com.cibertec.dto.LoginRequest;
import com.cibertec.dto.LoginResponse;
import com.cibertec.dto.UserResponse;
import com.cibertec.entity.User;
import com.cibertec.service.AuthService;
import com.cibertec.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Endpoint para login de usuarios
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Autenticar usuario y generar token
            String token = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
            
            // Obtener datos del usuario
            Optional<User> userOptional = userService.getUserByUsername(loginRequest.getUsername());
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "Usuario no encontrado"));
            }
            
            User user = userOptional.get();
            UserResponse userResponse = UserResponse.fromUser(user);
            
            // Crear respuesta exitosa
            LoginResponse response = new LoginResponse(
                    true,
                    "Login exitoso",
                    token,
                    userResponse
            );
            
            return ResponseEntity.ok(response);
            
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Credenciales inválidas: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(false, "Error interno del servidor: " + e.getMessage()));
        }
    }
    
    /**
     * Endpoint para validar token
     * POST /api/auth/validate
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "Token no proporcionado"));
            }
            
            String token = authHeader.substring(7);
            String username = authService.extractUsernameFromToken(token);
            
            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "Token inválido"));
            }
            
            boolean isValid = authService.validateToken(token, username);
            
            if (!isValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "Token expirado o inválido"));
            }
            
            // Obtener datos del usuario
            Optional<User> userOptional = userService.getUserByUsername(username);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "Usuario no encontrado"));
            }
            
            User user = userOptional.get();
            UserResponse userResponse = UserResponse.fromUser(user);
            
            return ResponseEntity.ok(new LoginResponse(true, "Token válido", token, userResponse));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(false, "Error al validar token: " + e.getMessage()));
        }
    }
    
    /**
     * Endpoint para obtener información del usuario actual
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "Token no proporcionado"));
            }
            
            String token = authHeader.substring(7);
            Optional<User> userOptional = authService.getUserFromToken(token);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse(false, "Usuario no encontrado"));
            }
            
            User user = userOptional.get();
            UserResponse userResponse = UserResponse.fromUser(user);
            
            return ResponseEntity.ok(userResponse);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse(false, "Error al obtener usuario: " + e.getMessage()));
        }
    }
}