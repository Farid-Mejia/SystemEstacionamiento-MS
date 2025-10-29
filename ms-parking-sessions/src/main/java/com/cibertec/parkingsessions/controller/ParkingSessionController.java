package com.cibertec.parkingsessions.controller;

import com.cibertec.parkingsessions.dto.ApiResponse;
import com.cibertec.parkingsessions.dto.CreateParkingSessionRequest;
import com.cibertec.parkingsessions.dto.ExitParkingSessionRequest;
import com.cibertec.parkingsessions.entity.ParkingSession;
import com.cibertec.parkingsessions.service.ParkingSessionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/parking-sessions")
@CrossOrigin(origins = "*")
public class ParkingSessionController {

    @Autowired
    private ParkingSessionService parkingSessionService;

    /**
     * Crear nueva sesión de estacionamiento
     * POST /api/parking-sessions
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ParkingSession>> createParkingSession(
            @Valid @RequestBody CreateParkingSessionRequest request) {
        try {
            ParkingSession session = parkingSessionService.createParkingSession(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Sesión de estacionamiento creada exitosamente", session));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno del servidor"));
        }
    }

    /**
     * Finalizar sesión de estacionamiento (salida)
     * PUT /api/parking-sessions/{id}/exit
     */
    @PutMapping("/{id}/exit")
    public ResponseEntity<ApiResponse<ParkingSession>> exitParkingSession(
            @PathVariable Long id,
            @RequestBody ExitParkingSessionRequest request) {
        try {
            ParkingSession session = parkingSessionService.exitParkingSession(id, request);
            return ResponseEntity.ok(ApiResponse.success("Salida registrada exitosamente", session));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno del servidor"));
        }
    }

    /**
     * Obtener sesiones activas por placa
     * GET /api/parking-sessions/active?license_plate={license_plate}
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ParkingSession>>> getActiveSessionsByLicensePlate(
            @RequestParam("license_plate") String licensePlate) {
        try {
            List<ParkingSession> sessions = parkingSessionService.getActiveSessionsByLicensePlate(licensePlate);
            return ResponseEntity.ok(ApiResponse.success("Sesiones activas obtenidas exitosamente", sessions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno del servidor"));
        }
    }

    /**
     * Obtener todas las sesiones
     * GET /api/parking-sessions
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ParkingSession>>> getAllParkingSessions() {
        try {
            List<ParkingSession> sessions = parkingSessionService.getAllParkingSessions();
            return ResponseEntity.ok(ApiResponse.success("Sesiones obtenidas exitosamente", sessions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno del servidor"));
        }
    }

    /**
     * Obtener sesión por ID
     * GET /api/parking-sessions/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ParkingSession>> getParkingSessionById(@PathVariable Long id) {
        try {
            Optional<ParkingSession> session = parkingSessionService.getParkingSessionById(id);
            if (session.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Sesión obtenida exitosamente", session.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Sesión no encontrada con ID: " + id));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno del servidor"));
        }
    }

    /**
     * Obtener sesión activa específica por placa
     * GET /api/parking-sessions/active/{license_plate}
     */
    @GetMapping("/active/{license_plate}")
    public ResponseEntity<ApiResponse<ParkingSession>> getActiveParkingSessionByLicensePlate(
            @PathVariable("license_plate") String licensePlate) {
        try {
            Optional<ParkingSession> session = parkingSessionService.getActiveParkingSessionByLicensePlate(licensePlate);
            if (session.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Sesión activa obtenida exitosamente", session.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("No se encontró sesión activa para la placa: " + licensePlate));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno del servidor"));
        }
    }

    /**
     * Obtener sesiones por visitante
     * GET /api/parking-sessions/visitor/{visitorId}
     */
    @GetMapping("/visitor/{visitorId}")
    public ResponseEntity<ApiResponse<List<ParkingSession>>> getSessionsByVisitorId(@PathVariable Long visitorId) {
        try {
            List<ParkingSession> sessions = parkingSessionService.getSessionsByVisitorId(visitorId);
            return ResponseEntity.ok(ApiResponse.success("Sesiones del visitante obtenidas exitosamente", sessions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno del servidor"));
        }
    }

    /**
     * Obtener sesiones por espacio de estacionamiento
     * GET /api/parking-sessions/space/{spaceId}
     */
    @GetMapping("/space/{spaceId}")
    public ResponseEntity<ApiResponse<List<ParkingSession>>> getSessionsByParkingSpaceId(@PathVariable Long spaceId) {
        try {
            List<ParkingSession> sessions = parkingSessionService.getSessionsByParkingSpaceId(spaceId);
            return ResponseEntity.ok(ApiResponse.success("Sesiones del espacio obtenidas exitosamente", sessions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno del servidor"));
        }
    }

    /**
     * Cancelar sesión
     * PUT /api/parking-sessions/{id}/cancel
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<ParkingSession>> cancelParkingSession(@PathVariable Long id) {
        try {
            ParkingSession session = parkingSessionService.cancelParkingSession(id);
            return ResponseEntity.ok(ApiResponse.success("Sesión cancelada exitosamente", session));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno del servidor"));
        }
    }

    /**
     * Obtener estadísticas de sesiones
     * GET /api/parking-sessions/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Object>> getSessionStats() {
        try {
            Long activeSessions = parkingSessionService.countActiveSessions();
            Long completedSessions = parkingSessionService.countByStatus(ParkingSession.SessionStatus.completed);
            Long cancelledSessions = parkingSessionService.countByStatus(ParkingSession.SessionStatus.cancelled);
            
            var stats = new Object() {
                public final Long active = activeSessions;
                public final Long completed = completedSessions;
                public final Long cancelled = cancelledSessions;
                public final Long total = activeSessions + completedSessions + cancelledSessions;
            };
            
            return ResponseEntity.ok(ApiResponse.success("Estadísticas obtenidas exitosamente", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno del servidor"));
        }
    }
}