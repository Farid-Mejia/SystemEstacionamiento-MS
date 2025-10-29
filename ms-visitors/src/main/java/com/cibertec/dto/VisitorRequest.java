package com.cibertec.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class VisitorRequest {

    @NotBlank(message = "DNI es requerido")
    @Pattern(regexp = "\\d{8}", message = "DNI debe tener exactamente 8 dígitos")
    private String dni;

    @NotBlank(message = "Nombres son requeridos")
    @Size(max = 100, message = "Nombres no puede exceder 100 caracteres")
    private String firstName;

    @NotBlank(message = "Apellido paterno es requerido")
    @Size(max = 50, message = "Apellido paterno no puede exceder 50 caracteres")
    private String paternalLastName;

    @NotBlank(message = "Apellido materno es requerido")
    @Size(max = 50, message = "Apellido materno no puede exceder 50 caracteres")
    private String maternalLastName;

    // Constructors
    public VisitorRequest() {}

    public VisitorRequest(String dni, String firstName, String paternalLastName, String maternalLastName) {
        this.dni = dni;
        this.firstName = firstName;
        this.paternalLastName = paternalLastName;
        this.maternalLastName = maternalLastName;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "VisitorRequest{" +
                "dni='" + dni + '\'' +
                ", firstName='" + firstName + '\'' +
                ", paternalLastName='" + paternalLastName + '\'' +
                ", maternalLastName='" + maternalLastName + '\'' +
                '}';
    }
}