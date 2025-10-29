package com.cibertec.parkingspaces.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateStatusRequest {

    @NotBlank(message = "El estado es obligatorio")
    @Pattern(regexp = "^(available|occupied|maintenance)$", message = "El estado debe ser 'available', 'occupied' o 'maintenance'")
    private String status;

    // Constructors
    public UpdateStatusRequest() {}

    public UpdateStatusRequest(String status) {
        this.status = status;
    }

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}