package com.cibertec.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "visitors")
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dni", unique = true, nullable = false, length = 8)
    @NotBlank(message = "DNI es requerido")
    @Pattern(regexp = "\\d{8}", message = "DNI debe tener exactamente 8 dígitos")
    private String dni;

    @Column(name = "first_name", nullable = false, length = 100)
    @NotBlank(message = "Nombres son requeridos")
    @Size(max = 100, message = "Nombres no puede exceder 100 caracteres")
    private String firstName;

    @Column(name = "paternal_last_name", nullable = false, length = 50)
    @NotBlank(message = "Apellido paterno es requerido")
    @Size(max = 50, message = "Apellido paterno no puede exceder 50 caracteres")
    private String paternalLastName;

    @Column(name = "maternal_last_name", nullable = false, length = 50)
    @NotBlank(message = "Apellido materno es requerido")
    @Size(max = 50, message = "Apellido materno no puede exceder 50 caracteres")
    private String maternalLastName;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Visitor() {}

    public Visitor(String dni, String firstName, String paternalLastName, String maternalLastName) {
        this.dni = dni;
        this.firstName = firstName;
        this.paternalLastName = paternalLastName;
        this.maternalLastName = maternalLastName;
    }

    // Getters and Setters
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

    // Helper method to get full name
    public String getFullName() {
        return firstName + " " + paternalLastName + " " + maternalLastName;
    }

    @Override
    public String toString() {
        return "Visitor{" +
                "id=" + id +
                ", dni='" + dni + '\'' +
                ", firstName='" + firstName + '\'' +
                ", paternalLastName='" + paternalLastName + '\'' +
                ", maternalLastName='" + maternalLastName + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}