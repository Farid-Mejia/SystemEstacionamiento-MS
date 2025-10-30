package com.cibertec.parkingsessions.service;

import com.cibertec.parkingsessions.dto.CreateParkingSessionRequest;
import com.cibertec.parkingsessions.dto.ExitParkingSessionRequest;
import com.cibertec.parkingsessions.dto.UpdateStatusRequest;
import com.cibertec.parkingsessions.entity.ParkingSession;
import com.cibertec.parkingsessions.repository.ParkingSessionRepository;
import com.cibertec.parkingsessions.client.ParkingSpaceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ParkingSessionService {

    @Autowired
    private ParkingSessionRepository parkingSessionRepository;
    
    @Autowired
    private ParkingSpaceClient parkingSpaceClient;

    // Obtener todas las sesiones
    public List<ParkingSession> getAllParkingSessions() {
        return parkingSessionRepository.findAll();
    }

    // Obtener sesión por ID
    public Optional<ParkingSession> getParkingSessionById(Long id) {
        return parkingSessionRepository.findById(id);
    }

    // Crear nueva sesión de estacionamiento
    public ParkingSession createParkingSession(CreateParkingSessionRequest request) {
        // Verificar si ya existe una sesión activa para esta placa
        if (parkingSessionRepository.existsByLicensePlateAndStatus(request.getLicensePlate(), ParkingSession.SessionStatus.active)) {
            throw new RuntimeException("Ya existe una sesión activa para la placa: " + request.getLicensePlate());
        }

        // Verificar si ya existe una sesión activa para este espacio
        if (parkingSessionRepository.existsByParkingSpaceIdAndStatus(request.getParkingSpaceId(), ParkingSession.SessionStatus.active)) {
            throw new RuntimeException("Ya existe una sesión activa para el espacio de estacionamiento: " + request.getParkingSpaceId());
        }

        ParkingSession parkingSession = new ParkingSession();
        parkingSession.setLicensePlate(request.getLicensePlate());
        parkingSession.setVisitorId(request.getVisitorId());
        parkingSession.setParkingSpaceId(request.getParkingSpaceId());
        parkingSession.setEntryTime(request.getEntryTime() != null ? request.getEntryTime() : LocalDateTime.now());
        parkingSession.setStatus(ParkingSession.SessionStatus.active);

        // Guardar la sesión de estacionamiento
        ParkingSession savedSession = parkingSessionRepository.save(parkingSession);
        
        // Actualizar el estado del espacio de estacionamiento a occupied
        try {
            updateParkingSpaceStatus(request.getParkingSpaceId(), "occupied");
        } catch (Exception e) {
            // Log del error pero no fallar la transacción principal
            System.err.println("Error al actualizar el estado del espacio de estacionamiento: " + e.getMessage());
        }

        return savedSession;
    }
    
    // Método privado para actualizar el estado del parking space usando OpenFeign
    private void updateParkingSpaceStatus(Long parkingSpaceId, String status) {
        try {
            System.out.println("=== INICIANDO ACTUALIZACIÓN DE ESTADO ===");
            System.out.println("Parking Space ID: " + parkingSpaceId);
            System.out.println("Nuevo estado: " + status);
            
            UpdateStatusRequest request = new UpdateStatusRequest(status);
            System.out.println("Request creado: " + request.getStatus());
            
            System.out.println("Llamando al cliente Feign...");
            parkingSpaceClient.updateParkingSpaceStatus(parkingSpaceId, request);
            System.out.println("Cliente Feign ejecutado exitosamente");
            System.out.println("=== ACTUALIZACIÓN COMPLETADA ===");
        } catch (Exception e) {
            System.err.println("=== ERROR EN ACTUALIZACIÓN ===");
            System.err.println("Error: " + e.getMessage());
            System.err.println("Tipo de error: " + e.getClass().getSimpleName());
            e.printStackTrace();
            throw new RuntimeException("Error al actualizar el estado del espacio de estacionamiento: " + e.getMessage());
        }
    }

    // Finalizar sesión (salida)
    public ParkingSession exitParkingSession(Long id, ExitParkingSessionRequest request) {
        Optional<ParkingSession> optionalSession = parkingSessionRepository.findById(id);
        
        if (optionalSession.isEmpty()) {
            throw new RuntimeException("Sesión de estacionamiento no encontrada con ID: " + id);
        }

        ParkingSession session = optionalSession.get();

        if (session.getStatus() != ParkingSession.SessionStatus.active) {
            throw new RuntimeException("La sesión no está activa y no puede ser finalizada");
        }

        LocalDateTime exitTime = request.getExitTime() != null ? request.getExitTime() : LocalDateTime.now();
        
        // Calcular duración en segundos
        Duration duration = Duration.between(session.getEntryTime(), exitTime);
        int durationSeconds = (int) duration.getSeconds();

        session.setExitTime(exitTime);
        session.setDurationSeconds(durationSeconds);
        session.setStatus(ParkingSession.SessionStatus.completed);

        // Guardar la sesión actualizada
        ParkingSession savedSession = parkingSessionRepository.save(session);
        
        // Actualizar el estado del espacio de estacionamiento a available
        try {
            updateParkingSpaceStatus(session.getParkingSpaceId(), "available");
        } catch (Exception e) {
            // Log del error pero no fallar la transacción principal
            System.err.println("Error al actualizar el estado del espacio de estacionamiento: " + e.getMessage());
        }

        return savedSession;
    }

    // Buscar sesiones activas por placa
    public List<ParkingSession> getActiveSessionsByLicensePlate(String licensePlate) {
        return parkingSessionRepository.findByLicensePlateAndStatus(licensePlate, ParkingSession.SessionStatus.active);
    }

    // Buscar sesión activa específica por placa
    public Optional<ParkingSession> getActiveParkingSessionByLicensePlate(String licensePlate) {
        return parkingSessionRepository.findActiveParkingSessionByLicensePlate(licensePlate, ParkingSession.SessionStatus.active);
    }

    // Buscar sesiones por visitante
    public List<ParkingSession> getSessionsByVisitorId(Long visitorId) {
        return parkingSessionRepository.findByVisitorId(visitorId);
    }

    // Buscar sesiones por espacio de estacionamiento
    public List<ParkingSession> getSessionsByParkingSpaceId(Long parkingSpaceId) {
        return parkingSessionRepository.findByParkingSpaceId(parkingSpaceId);
    }

    // Buscar sesiones por estado
    public List<ParkingSession> getSessionsByStatus(ParkingSession.SessionStatus status) {
        return parkingSessionRepository.findByStatus(status);
    }

    // Obtener todas las sesiones activas
    public List<ParkingSession> getAllActiveSessions() {
        return parkingSessionRepository.findAllActiveSessions();
    }

    // Cancelar sesión
    public ParkingSession cancelParkingSession(Long id) {
        Optional<ParkingSession> optionalSession = parkingSessionRepository.findById(id);
        
        if (optionalSession.isEmpty()) {
            throw new RuntimeException("Sesión de estacionamiento no encontrada con ID: " + id);
        }

        ParkingSession session = optionalSession.get();

        if (session.getStatus() != ParkingSession.SessionStatus.active) {
            throw new RuntimeException("Solo se pueden cancelar sesiones activas");
        }

        session.setStatus(ParkingSession.SessionStatus.cancelled);
        return parkingSessionRepository.save(session);
    }

    // Obtener estadísticas
    public Long countByStatus(ParkingSession.SessionStatus status) {
        return parkingSessionRepository.countByStatus(status);
    }

    public Long countActiveSessions() {
        return parkingSessionRepository.countActiveSessions();
    }
}