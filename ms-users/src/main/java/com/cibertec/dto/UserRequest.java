package com.cibertec.dto;

import com.cibertec.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserRequest {
    
    @NotBlank(message = "DNI es requerido")
    @Size(min = 8, max = 8, message = "DNI debe tener 8 dígitos")
    private String dni;
    
    @NotBlank(message = "Username es requerido")
    @Size(max = 50, message = "Username no puede exceder 50 caracteres")
    private String username;
    
    private String password; // Opcional para actualizaciones
    
    @NotBlank(message = "Nombre es requerido")
    @Size(max = 100, message = "Nombre no puede exceder 100 caracteres")
    private String firstName;
    
    @NotBlank(message = "Apellido paterno es requerido")
    @Size(max = 100, message = "Apellido paterno no puede exceder 100 caracteres")
    private String paternalLastName;
    
    @NotBlank(message = "Apellido materno es requerido")
    @Size(max = 100, message = "Apellido materno no puede exceder 100 caracteres")
    private String maternalLastName;
    
    @NotNull(message = "Rol es requerido")
    private Role role;
    
    // Constructores
    public UserRequest() {}
    
    public UserRequest(String dni, String username, String password, String firstName, 
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
    
    @Override
    public String toString() {
        return "UserRequest{" +
                "dni='" + dni + '\'' +
                ", username='" + username + '\'' +
                ", password='" + (password != null ? "[PROTECTED]" : "null") + '\'' +
                ", firstName='" + firstName + '\'' +
                ", paternalLastName='" + paternalLastName + '\'' +
                ", maternalLastName='" + maternalLastName + '\'' +
                ", role=" + role +
                '}';
    }
}