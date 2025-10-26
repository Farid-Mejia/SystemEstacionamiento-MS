package com.cibertec.service;

import com.cibertec.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Autenticar usuario y generar token JWT
     */
    public String authenticate(String username, String password) {
        try {
            // Buscar usuario por username
            Optional<User> userOptional = userService.getUserByUsername(username);
            
            if (userOptional.isEmpty()) {
                throw new BadCredentialsException("Usuario no encontrado: " + username);
            }
            
            User user = userOptional.get();
            
            // Verificar contraseña
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new BadCredentialsException("Contraseña incorrecta");
            }
            
            // Generar y retornar token JWT
            return jwtService.generateToken(user);
            
        } catch (Exception e) {
            throw new BadCredentialsException("Error en la autenticación: " + e.getMessage());
        }
    }
    
    /**
     * Obtener usuario autenticado por token
     */
    public Optional<User> getUserFromToken(String token) {
        try {
            String username = jwtService.extractUsername(token);
            return userService.getUserByUsername(username);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    /**
     * Validar token JWT
     */
    public boolean validateToken(String token, String username) {
        try {
            return jwtService.isTokenValid(token, username);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Extraer username del token
     */
    public String extractUsernameFromToken(String token) {
        try {
            return jwtService.extractUsername(token);
        } catch (Exception e) {
            return null;
        }
    }
    
    /**
     * Extraer rol del token
     */
    public String extractRoleFromToken(String token) {
        try {
            return jwtService.extractRole(token);
        } catch (Exception e) {
            return null;
        }
    }
    
    /**
     * Verificar si el usuario tiene el rol requerido
     */
    public boolean hasRole(String token, String requiredRole) {
        try {
            String userRole = jwtService.extractRole(token);
            return requiredRole.equals(userRole);
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Verificar si el usuario es administrador
     */
    public boolean isAdmin(String token) {
        return hasRole(token, "ADMIN");
    }
    
    /**
     * Verificar si el usuario es operador
     */
    public boolean isOperator(String token) {
        return hasRole(token, "OPERATOR");
    }
}