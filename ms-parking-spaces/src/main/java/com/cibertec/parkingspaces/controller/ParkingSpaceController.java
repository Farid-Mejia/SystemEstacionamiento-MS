package com.cibertec.parkingspaces.controller;

import com.cibertec.parkingspaces.dto.ApiResponse;
import com.cibertec.parkingspaces.dto.CreateParkingSpaceRequest;
import com.cibertec.parkingspaces.dto.UpdateParkingSpaceRequest;
import com.cibertec.parkingspaces.entity.ParkingSpace;
import com.cibertec.parkingspaces.service.ParkingSpaceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/parking-spaces")
@CrossOrigin(origins = "*")
public class ParkingSpaceController {

    @Autowired
    private ParkingSpaceService parkingSpaceService;

    // Obtener todos los espacios de estacionamiento con filtros opcionales
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllParkingSpaces(
            @RequestParam(required = false) String floor,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean isDisabledSpace) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<ParkingSpace> parkingSpaces = parkingSpaceService.filterParkingSpaces(floor, status, isDisabledSpace);
            response.put("success", true);
            response.put("data", parkingSpaces);
            response.put("total", parkingSpaces.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener los espacios de estacionamiento: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Obtener espacio por ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ParkingSpace>> getParkingSpaceById(@PathVariable Long id) {
        try {
            Optional<ParkingSpace> parkingSpace = parkingSpaceService.getParkingSpaceById(id);
            
            if (parkingSpace.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success(parkingSpace.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Espacio de estacionamiento no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener el espacio de estacionamiento: " + e.getMessage()));
        }
    }

    // Obtener espacio por número
    @GetMapping("/number/{spaceNumber}")
    public ResponseEntity<ApiResponse<ParkingSpace>> getParkingSpaceByNumber(@PathVariable Integer spaceNumber) {
        try {
            Optional<ParkingSpace> parkingSpace = parkingSpaceService.getParkingSpaceByNumber(spaceNumber);
            
            if (parkingSpace.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success(parkingSpace.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Espacio de estacionamiento no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener el espacio de estacionamiento: " + e.getMessage()));
        }
    }

    // Crear nuevo espacio de estacionamiento
    @PostMapping
    public ResponseEntity<ApiResponse<ParkingSpace>> createParkingSpace(@Valid @RequestBody CreateParkingSpaceRequest request) {
        try {
            ParkingSpace createdParkingSpace = parkingSpaceService.createParkingSpace(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Espacio de estacionamiento creado exitosamente", createdParkingSpace));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear el espacio de estacionamiento: " + e.getMessage()));
        }
    }

    // Actualizar espacio de estacionamiento
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ParkingSpace>> updateParkingSpace(
            @PathVariable Long id, 
            @Valid @RequestBody UpdateParkingSpaceRequest request) {
        
        try {
            ParkingSpace updatedParkingSpace = parkingSpaceService.updateParkingSpace(id, request);
            return ResponseEntity.ok(ApiResponse.success("Espacio de estacionamiento actualizado exitosamente", updatedParkingSpace));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar el espacio de estacionamiento: " + e.getMessage()));
        }
    }

    // Eliminar espacio de estacionamiento
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteParkingSpace(@PathVariable Long id) {
        try {
            parkingSpaceService.deleteParkingSpace(id);
            return ResponseEntity.ok(ApiResponse.success("Espacio de estacionamiento eliminado exitosamente", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar el espacio de estacionamiento: " + e.getMessage()));
        }
    }

    // Obtener estadísticas
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Estadísticas por estado
            stats.put("available", parkingSpaceService.countByStatus("available"));
            stats.put("occupied", parkingSpaceService.countByStatus("occupied"));
            stats.put("maintenance", parkingSpaceService.countByStatus("maintenance"));
            
            // Estadísticas por piso
            stats.put("floorSS", parkingSpaceService.countByFloor("SS"));
            stats.put("floorS1", parkingSpaceService.countByFloor("S1"));
            
            // Total de espacios
            List<ParkingSpace> allSpaces = parkingSpaceService.getAllParkingSpaces();
            stats.put("total", allSpaces.size());
            
            // Espacios para discapacitados
            long disabledSpaces = allSpaces.stream()
                    .mapToLong(space -> space.getIsDisabledSpace() ? 1 : 0)
                    .sum();
            stats.put("disabledSpaces", disabledSpaces);
            
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener las estadísticas: " + e.getMessage()));
        }
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, String>>> health() {
        Map<String, String> healthStatus = new HashMap<>();
        healthStatus.put("status", "UP");
        healthStatus.put("service", "ms-parking-spaces");
        return ResponseEntity.ok(ApiResponse.success(healthStatus));
    }
}