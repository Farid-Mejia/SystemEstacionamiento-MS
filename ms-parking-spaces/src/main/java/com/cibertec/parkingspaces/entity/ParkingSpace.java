package com.cibertec.parkingspaces.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "parking_spaces")
public class ParkingSpace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "space_number", unique = true, nullable = false)
    private Integer spaceNumber;

    @NotNull
    @Column(name = "floor", nullable = false, length = 5)
    private String floor; // 'SS' o 'S1'

    @Column(name = "is_disabled_space", nullable = false)
    private Boolean isDisabledSpace = false;

    @NotNull
    @Column(name = "status", nullable = false, length = 20)
    private String status = "available"; // 'available', 'occupied', 'maintenance'

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public ParkingSpace() {}

    public ParkingSpace(Integer spaceNumber, String floor, Boolean isDisabledSpace, String status) {
        this.spaceNumber = spaceNumber;
        this.floor = floor;
        this.isDisabledSpace = isDisabledSpace;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
        return "ParkingSpace{" +
                "id=" + id +
                ", spaceNumber=" + spaceNumber +
                ", floor='" + floor + '\'' +
                ", isDisabledSpace=" + isDisabledSpace +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}