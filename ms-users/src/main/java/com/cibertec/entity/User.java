package com.cibertec.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 8)
    @NotBlank(message = "DNI es requerido")
    @Size(min = 8, max = 8, message = "DNI debe tener 8 dígitos")
    private String dni;
    
    @Column(unique = true, nullable = false, length = 50)
    @NotBlank(message = "Username es requerido")
    @Size(max = 50, message = "Username no puede exceder 50 caracteres")
    private String username;
    
    @Column(nullable = false)
    @NotBlank(message = "Password es requerido")
    private String password;
    
    @Column(name = "first_name", nullable = false, length = 100)
    @NotBlank(message = "Nombre es requerido")
    @Size(max = 100, message = "Nombre no puede exceder 100 caracteres")
    private String firstName;
    
    @Column(name = "paternal_last_name", nullable = false, length = 100)
    @NotBlank(message = "Apellido paterno es requerido")
    @Size(max = 100, message = "Apellido paterno no puede exceder 100 caracteres")
    private String paternalLastName;
    
    @Column(name = "maternal_last_name", nullable = false, length = 100)
    @NotBlank(message = "Apellido materno es requerido")
    @Size(max = 100, message = "Apellido materno no puede exceder 100 caracteres")
    private String maternalLastName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @NotNull(message = "Rol es requerido")
    private Role role = Role.OPERATOR;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructores
    public User() {}
    
    public User(String dni, String username, String password, String firstName, 
                String paternalLastName, String maternalLastName, Role role) {
        this.dni = dni;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.paternalLastName = paternalLastName;
        this.maternalLastName = maternalLastName;
        this.role = role;
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
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
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
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
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
        return "User{" +
                "id=" + id +
                ", dni='" + dni + '\'' +
                ", username='" + username + '\'' +
                ", firstName='" + firstName + '\'' +
                ", paternalLastName='" + paternalLastName + '\'' +
                ", maternalLastName='" + maternalLastName + '\'' +
                ", role=" + role +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}