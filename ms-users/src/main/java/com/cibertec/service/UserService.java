package com.cibertec.service;

import com.cibertec.entity.Role;
import com.cibertec.entity.User;
import com.cibertec.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Crear un nuevo usuario
     */
    public User createUser(User user) {
        // Verificar que no exista el username
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("El username ya existe: " + user.getUsername());
        }
        
        // Verificar que no exista el DNI
        if (userRepository.existsByDni(user.getDni())) {
            throw new RuntimeException("El DNI ya existe: " + user.getDni());
        }
        
        // Encriptar la contraseña
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }
    
    /**
     * Obtener usuario por ID
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * Obtener usuario por username
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    /**
     * Obtener usuario por DNI
     */
    public Optional<User> getUserByDni(String dni) {
        return userRepository.findByDni(dni);
    }
    
    /**
     * Obtener todos los usuarios
     */
    public List<User> getAllUsers() {
        return userRepository.findAllActiveUsers();
    }
    
    /**
     * Obtener usuarios por rol
     */
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
    
    /**
     * Actualizar usuario
     */
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        
        // Verificar username único (si se está cambiando)
        if (!user.getUsername().equals(userDetails.getUsername()) && 
            userRepository.existsByUsername(userDetails.getUsername())) {
            throw new RuntimeException("El username ya existe: " + userDetails.getUsername());
        }
        
        // Verificar DNI único (si se está cambiando)
        if (!user.getDni().equals(userDetails.getDni()) && 
            userRepository.existsByDni(userDetails.getDni())) {
            throw new RuntimeException("El DNI ya existe: " + userDetails.getDni());
        }
        
        // Actualizar campos
        user.setDni(userDetails.getDni());
        user.setUsername(userDetails.getUsername());
        user.setFirstName(userDetails.getFirstName());
        user.setPaternalLastName(userDetails.getPaternalLastName());
        user.setMaternalLastName(userDetails.getMaternalLastName());
        user.setRole(userDetails.getRole());
        
        // Solo actualizar password si se proporciona uno nuevo
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        
        return userRepository.save(user);
    }
    
    /**
     * Eliminar usuario
     */
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        
        userRepository.delete(user);
    }
    
    /**
     * Verificar si existe un usuario con el username
     */
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    /**
     * Verificar si existe un usuario con el DNI
     */
    public boolean existsByDni(String dni) {
        return userRepository.existsByDni(dni);
    }
    
    /**
     * Buscar usuarios por nombre
     */
    public List<User> searchUsersByFirstName(String firstName) {
        return userRepository.findByFirstNameContainingIgnoreCase(firstName);
    }
    
    /**
     * Buscar usuarios por apellido paterno
     */
    public List<User> searchUsersByPaternalLastName(String paternalLastName) {
        return userRepository.findByPaternalLastNameContainingIgnoreCase(paternalLastName);
    }
    
    /**
     * Contar usuarios por rol
     */
    public long countUsersByRole(Role role) {
        return userRepository.countByRole(role);
    }
    
    /**
     * Cambiar contraseña de usuario
     */
    public void changePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}