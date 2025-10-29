package com.cibertec.controller;

import com.cibertec.dto.VisitorRequest;
import com.cibertec.dto.VisitorResponse;
import com.cibertec.service.VisitorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/visitors")
@Validated
public class VisitorController {

    private static final Logger logger = LoggerFactory.getLogger(VisitorController.class);

    @Autowired
    private VisitorService visitorService;

    /**
     * Crear un nuevo visitante
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createVisitor(@Valid @RequestBody VisitorRequest request) {
        logger.info("Solicitud para crear visitante con DNI: {}", request.getDni());
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            VisitorResponse visitor = visitorService.createVisitor(request);
            response.put("success", true);
            response.put("message", "Visitante creado exitosamente");
            response.put("data", visitor);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            logger.error("Error al crear visitante: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Obtener visitante por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getVisitorById(@PathVariable @NotNull Long id) {
        logger.info("Solicitud para obtener visitante por ID: {}", id);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            VisitorResponse visitor = visitorService.getVisitorById(id);
            response.put("success", true);
            response.put("data", visitor);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al obtener visitante por ID: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Obtener visitante por DNI
     */
    @GetMapping("/dni/{dni}")
    public ResponseEntity<Map<String, Object>> getVisitorByDni(@PathVariable @NotBlank String dni) {
        logger.info("Solicitud para obtener visitante por DNI: {}", dni);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            VisitorResponse visitor = visitorService.getVisitorByDni(dni);
            response.put("success", true);
            response.put("data", visitor);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al obtener visitante por DNI: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Obtener todos los visitantes
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllVisitors() {
        logger.info("Solicitud para obtener todos los visitantes");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<VisitorResponse> visitors = visitorService.getAllVisitors();
            response.put("success", true);
            response.put("data", visitors);
            response.put("total", visitors.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al obtener visitantes: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Buscar visitantes por nombre
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchVisitorsByName(@RequestParam @NotBlank String name) {
        logger.info("Solicitud para buscar visitantes por nombre: {}", name);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<VisitorResponse> visitors = visitorService.searchVisitorsByName(name);
            response.put("success", true);
            response.put("data", visitors);
            response.put("total", visitors.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al buscar visitantes por nombre: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Buscar visitantes por apellido paterno
     */
    @GetMapping("/paternal-lastname/{paternalLastName}")
    public ResponseEntity<Map<String, Object>> getVisitorsByPaternalLastName(@PathVariable @NotBlank String paternalLastName) {
        logger.info("Solicitud para buscar visitantes por apellido paterno: {}", paternalLastName);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<VisitorResponse> visitors = visitorService.getVisitorsByPaternalLastName(paternalLastName);
            response.put("success", true);
            response.put("data", visitors);
            response.put("total", visitors.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al buscar visitantes por apellido paterno: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Actualizar visitante
     */
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateVisitor(@PathVariable @NotNull Long id, @Valid @RequestBody VisitorRequest request) {
        logger.info("Solicitud para actualizar visitante con ID: {}", id);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            VisitorResponse visitor = visitorService.updateVisitor(id, request);
            response.put("success", true);
            response.put("message", "Visitante actualizado exitosamente");
            response.put("data", visitor);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al actualizar visitante: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Eliminar visitante
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteVisitor(@PathVariable @NotNull Long id) {
        logger.info("Solicitud para eliminar visitante con ID: {}", id);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            visitorService.deleteVisitor(id);
            response.put("success", true);
            response.put("message", "Visitante eliminado exitosamente");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al eliminar visitante: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Verificar si existe un visitante por DNI
     */
    @GetMapping("/exists/dni/{dni}")
    public ResponseEntity<Map<String, Object>> checkVisitorExistsByDni(@PathVariable @NotBlank String dni) {
        logger.info("Verificando si existe visitante con DNI: {}", dni);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean exists = visitorService.existsByDni(dni);
            response.put("success", true);
            response.put("exists", exists);
            response.put("dni", dni);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error al verificar existencia de visitante: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "ms-visitors");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}