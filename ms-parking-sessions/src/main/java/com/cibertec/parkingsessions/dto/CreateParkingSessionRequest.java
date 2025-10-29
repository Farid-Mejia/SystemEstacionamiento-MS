package com.cibertec.parkingsessions.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class CreateParkingSessionRequest {

    @NotNull(message = "La placa es requerida")
    @Size(max = 10, message = "La placa no puede tener más de 10 caracteres")
    private String licensePlate;

    @NotNull(message = "El ID del visitante es requerido")
    private Long visitorId;

    @NotNull(message = "El ID del espacio de estacionamiento es requerido")
    private Long parkingSpaceId;

    private LocalDateTime entryTime;

    // Constructors
    public CreateParkingSessionRequest() {}

    public CreateParkingSessionRequest(String licensePlate, Long visitorId, Long parkingSpaceId, LocalDateTime entryTime) {
        this.licensePlate = licensePlate;
        this.visitorId = visitorId;
        this.parkingSpaceId = parkingSpaceId;
        this.entryTime = entryTime;
    }

    // Getters and Setters
    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public Long getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(Long visitorId) {
        this.visitorId = visitorId;
    }

    public Long getParkingSpaceId() {
        return parkingSpaceId;
    }

    public void setParkingSpaceId(Long parkingSpaceId) {
        this.parkingSpaceId = parkingSpaceId;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }
}