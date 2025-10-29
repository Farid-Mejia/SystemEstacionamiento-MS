package com.cibertec.parkingsessions.service;

import com.cibertec.parkingsessions.dto.CreateParkingSessionRequest;
import com.cibertec.parkingsessions.dto.ExitParkingSessionRequest;
import com.cibertec.parkingsessions.entity.ParkingSession;
import com.cibertec.parkingsessions.repository.ParkingSessionRepository;
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

        return parkingSessionRepository.save(parkingSession);
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

        return parkingSessionRepository.save(session);
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