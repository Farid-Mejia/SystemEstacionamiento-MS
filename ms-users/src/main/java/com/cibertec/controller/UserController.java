package com.cibertec.controller;

import com.cibertec.dto.UserRequest;
import com.cibertec.dto.UserResponse;
import com.cibertec.entity.Role;
import com.cibertec.entity.User;
import com.cibertec.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Crear nuevo usuario
     * POST /api/users
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequest userRequest) {
        try {
            // Convertir UserRequest a User
            User user = new User(
                    userRequest.getDni(),
                    userRequest.getUsername(),
                    userRequest.getPassword(),
                    userRequest.getFirstName(),
                    userRequest.getPaternalLastName(),
                    userRequest.getMaternalLastName(),
                    userRequest.getRole());

            User savedUser = userService.createUser(user);
            UserResponse userResponse = UserResponse.fromUser(savedUser);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userResponse);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Obtener todos los usuarios
     * GET /api/users
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            List<UserResponse> userResponses = users.stream()
                    .map(UserResponse::fromUser)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userResponses);
            response.put("total", userResponses.size());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Obtener usuario por ID
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> userOptional = userService.getUserById(id);

            if (userOptional.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            User user = userOptional.get();
            UserResponse userResponse = UserResponse.fromUser(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userResponse);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Obtener usuario por DNI
     * GET /api/users/dni/{dni}
     */
    @GetMapping("/dni/{dni}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OPERATOR')")
    public ResponseEntity<?> getUserByDni(@PathVariable String dni) {
        try {
            Optional<User> userOptional = userService.getUserByDni(dni);

            if (userOptional.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            User user = userOptional.get();
            UserResponse userResponse = UserResponse.fromUser(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userResponse);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Actualizar usuario
     * PUT /api/users/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest userRequest) {
        try {
            // Convertir UserRequest a User
            User userDetails = new User(
                    userRequest.getDni(),
                    userRequest.getUsername(),
                    userRequest.getPassword(),
                    userRequest.getFirstName(),
                    userRequest.getPaternalLastName(),
                    userRequest.getMaternalLastName(),
                    userRequest.getRole());

            User updatedUser = userService.updateUser(id, userDetails);
            UserResponse userResponse = UserResponse.fromUser(updatedUser);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userResponse);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Eliminar usuario
     * DELETE /api/users/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Obtener usuarios por rol
     * GET /api/users/role/{role}
     */
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsersByRole(@PathVariable String role) {
        try {
            Role userRole = Role.valueOf(role.toUpperCase());
            List<User> users = userService.getUsersByRole(userRole);
            List<UserResponse> userResponses = users.stream()
                    .map(UserResponse::fromUser)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userResponses);
            response.put("total", userResponses.size());
            response.put("role", role);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Endpoint de prueba para verificar respuesta
     * GET /api/users/test
     */
    @GetMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", "TEST DATA");
        response.put("message", "Test endpoint working correctly");

        return ResponseEntity.ok(response);
    }
}