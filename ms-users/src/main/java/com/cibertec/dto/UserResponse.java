package com.cibertec.dto;

import com.cibertec.entity.Role;
import com.cibertec.entity.User;

import java.time.LocalDateTime;

public class UserResponse {
    
    private Long id;
    private String dni;
    private String username;
    private String firstName;
    private String paternalLastName;
    private String maternalLastName;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructores
    public UserResponse() {}
    
    public UserResponse(Long id, String dni, String username, String firstName, 
                       String paternalLastName, String maternalLastName, String role,
                       LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.dni = dni;
        this.username = username;
        this.firstName = firstName;
        this.paternalLastName = paternalLastName;
        this.maternalLastName = maternalLastName;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Constructor desde entidad User
    public UserResponse(User user) {
        this.id = user.getId();
        this.dni = user.getDni();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.paternalLastName = user.getPaternalLastName();
        this.maternalLastName = user.getMaternalLastName();
        this.role = user.getRole().getValue();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }
    
    // Método estático para convertir User a UserResponse
    public static UserResponse fromUser(User user) {
        return new UserResponse(user);
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getDni() {
        return dni;
    }
    
    public void setDni(String dni) {
        this.dni = dni;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getPaternalLastName() {
        return paternalLastName;
    }
    
    public void setPaternalLastName(String paternalLastName) {
        this.paternalLastName = paternalLastName;
    }
    
    public String getMaternalLastName() {
        return maternalLastName;
    }
    
    public void setMaternalLastName(String maternalLastName) {
        this.maternalLastName = maternalLastName;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @Override
    public String toString() {
        return "UserResponse{" +
                "id=" + id +
                ", dni='" + dni + '\'' +
                ", username='" + username + '\'' +
                ", firstName='" + firstName + '\'' +
                ", paternalLastName='" + paternalLastName + '\'' +
                ", maternalLastName='" + maternalLastName + '\'' +
                ", role='" + role + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}