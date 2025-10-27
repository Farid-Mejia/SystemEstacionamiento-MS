package com.cibertec.web.controller;

import com.cibertec.application.service.ParkingService;
import com.cibertec.web.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parking")
@RequiredArgsConstructor
public class ParkingController {

    private final ParkingService service;

    @GetMapping("/spaces")
    public ResponseEntity<SpacesResponseDTO> listarEspacios() {
        SpacesResponseDTO response = service.getAllSpaces();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/entry")
    public ResponseEntity<?> registrarIngreso(@RequestBody ParkingEntryRequestDTO request) {
        try {
            ParkingEntryResponseDTO entryResponse = service.registerEntry(request);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Ingreso registrado exitosamente", entryResponse)
            );
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("no está disponible")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(false, e.getMessage(), null));
            }
            if (e.getMessage().contains("Visitante no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, e.getMessage(), null));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/exit")
    public ResponseEntity<?> registrarSalida(@RequestBody ParkingExitRequestDTO request) {
        try {
            ParkingExitResponseDTO exitResponse = service.registerExit(request);
            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Salida registrada exitosamente", exitResponse)
            );
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("No se encontró registro activo")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "No se encontró una sesión activa para este vehículo", null));
            }
            if (e.getMessage().contains("Visitante no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, e.getMessage(), null));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T session;
    }
}
