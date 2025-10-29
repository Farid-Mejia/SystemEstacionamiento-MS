package com.cibertec.parkingsessions.dto;

import java.time.LocalDateTime;

public class ExitParkingSessionRequest {

    private LocalDateTime exitTime;

    // Constructors
    public ExitParkingSessionRequest() {}

    public ExitParkingSessionRequest(LocalDateTime exitTime) {
        this.exitTime = exitTime;
    }

    // Getters and Setters
    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
    }
}