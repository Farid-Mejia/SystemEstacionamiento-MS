package com.cibertec.parkingsessions.controller;

import com.cibertec.parkingsessions.dto.CreateParkingSessionRequest;
import com.cibertec.parkingsessions.entity.ParkingSession;
import com.cibertec.parkingsessions.service.ParkingSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Autowired
    private ParkingSessionService parkingSessionService;
    
    @GetMapping("/health")
    public String health() {
        return "MS Parking Sessions is running!";
    }
    
    @PostMapping("/create-session")
    public String createTestSession() {
        try {
            // Generar una placa única basada en timestamp
            String uniquePlate = "TEST" + System.currentTimeMillis() % 10000;
            
            CreateParkingSessionRequest request = new CreateParkingSessionRequest();
            request.setLicensePlate(uniquePlate);
            request.setVisitorId(1L);
            request.setParkingSpaceId(10L); // Usar parking space ID 10 (número 1)
            request.setEntryTime(LocalDateTime.now());
            
            ParkingSession session = parkingSessionService.createParkingSession(request);
            return "Sesión creada exitosamente con ID: " + session.getId() + 
                   " y placa: " + uniquePlate + 
                   ". Verificar si el parking space ID 10 cambió a estado 'occupied'.";
        } catch (Exception e) {
            return "Error al crear sesión: " + e.getMessage();
        }
    }
}