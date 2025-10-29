package com.cibertec.parkingsessions.repository;

import com.cibertec.parkingsessions.entity.ParkingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSessionRepository extends JpaRepository<ParkingSession, Long> {

    // Buscar sesiones activas por placa
    List<ParkingSession> findByLicensePlateAndStatus(String licensePlate, ParkingSession.SessionStatus status);

    // Buscar sesiones por visitante
    List<ParkingSession> findByVisitorId(Long visitorId);

    // Buscar sesiones por espacio de estacionamiento
    List<ParkingSession> findByParkingSpaceId(Long parkingSpaceId);

    // Buscar sesiones por estado
    List<ParkingSession> findByStatus(ParkingSession.SessionStatus status);

    // Buscar sesión activa por espacio de estacionamiento
    Optional<ParkingSession> findByParkingSpaceIdAndStatus(Long parkingSpaceId, ParkingSession.SessionStatus status);

    // Buscar sesión activa por placa (solo una activa por placa)
    @Query("SELECT ps FROM ParkingSession ps WHERE ps.licensePlate = :licensePlate AND ps.status = :status")
    Optional<ParkingSession> findActiveParkingSessionByLicensePlate(@Param("licensePlate") String licensePlate, @Param("status") ParkingSession.SessionStatus status);

    // Contar sesiones por estado
    @Query("SELECT COUNT(ps) FROM ParkingSession ps WHERE ps.status = :status")
    Long countByStatus(@Param("status") ParkingSession.SessionStatus status);

    // Contar sesiones activas
    @Query("SELECT COUNT(ps) FROM ParkingSession ps WHERE ps.status = 'active'")
    Long countActiveSessions();

    // Buscar todas las sesiones activas
    @Query("SELECT ps FROM ParkingSession ps WHERE ps.status = 'active'")
    List<ParkingSession> findAllActiveSessions();

    // Verificar si existe una sesión activa para un espacio específico
    boolean existsByParkingSpaceIdAndStatus(Long parkingSpaceId, ParkingSession.SessionStatus status);

    // Verificar si existe una sesión activa para una placa específica
    boolean existsByLicensePlateAndStatus(String licensePlate, ParkingSession.SessionStatus status);
}