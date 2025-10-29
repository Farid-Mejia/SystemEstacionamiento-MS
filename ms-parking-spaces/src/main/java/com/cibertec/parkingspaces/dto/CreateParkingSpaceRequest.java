package com.cibertec.parkingspaces.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class CreateParkingSpaceRequest {

    @NotNull(message = "El número de espacio es requerido")
    private Integer spaceNumber;

    @NotNull(message = "El piso es requerido")
    @Pattern(regexp = "^(SS|S1)$", message = "El piso debe ser 'SS' o 'S1'")
    private String floor;

    private Boolean isDisabledSpace = false;

    @Pattern(regexp = "^(available|occupied|maintenance)$", message = "El estado debe ser 'available', 'occupied' o 'maintenance'")
    private String status = "available";

    // Constructors
    public CreateParkingSpaceRequest() {}

    public CreateParkingSpaceRequest(Integer spaceNumber, String floor, Boolean isDisabledSpace, String status) {
        this.spaceNumber = spaceNumber;
        this.floor = floor;
        this.isDisabledSpace = isDisabledSpace;
        this.status = status;
    }

    // Getters and Setters
    public Integer getSpaceNumber() {
        return spaceNumber;
    }

    public void setSpaceNumber(Integer spaceNumber) {
        this.spaceNumber = spaceNumber;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public Boolean getIsDisabledSpace() {
        return isDisabledSpace;
    }

    public void setIsDisabledSpace(Boolean isDisabledSpace) {
        this.isDisabledSpace = isDisabledSpace;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}