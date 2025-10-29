package com.cibertec.web.controller;

import com.cibertec.application.service.VisitorService;
import com.cibertec.web.dto.VisitorAPIResponse;
import com.cibertec.web.dto.VisitorRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
@Slf4j
public class VisitorController {

  private final VisitorService visitorService;

  /**
   * Obtener visitante por DNI
   * Requiere autenticación JWT
   */
  @GetMapping("/dni/{dni}")
  @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR', 'SECURITY')")
  public ResponseEntity<VisitorAPIResponse> getVisitorByDni(@PathVariable String dni) {
    log.info("GET /api/visitors/dni/{} - Buscando visitante", dni);
    VisitorAPIResponse response = visitorService.getVisitorByDni(dni);
    return ResponseEntity.ok(response);
  }

  /**
   * Obtener todos los visitantes
   * Requiere rol ADMIN u OPERATOR
   */
  @GetMapping
  @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
  public ResponseEntity<List<VisitorAPIResponse>> getAllVisitors() {
    log.info("GET /api/visitors - Obteniendo todos los visitantes");
    List<VisitorAPIResponse> response = visitorService.getAllVisitors();
    return ResponseEntity.ok(response);
  }

  /**
   * Crear nuevo visitante
   * Requiere rol ADMIN u OPERATOR
   */
  @PostMapping
  @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
  public ResponseEntity<VisitorAPIResponse> createVisitor(@RequestBody VisitorRequestDto visitorRequest) {
    log.info("POST /api/visitors - Creando visitante con DNI: {}", visitorRequest.getDni());
    VisitorAPIResponse response = visitorService.createVisitor(visitorRequest);

    if (response.getSuccess()) {
      return new ResponseEntity<>(response, HttpStatus.CREATED);
    } else {
      return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Actualizar visitante existente
   * Requiere rol ADMIN u OPERATOR
   */
  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
  public ResponseEntity<VisitorAPIResponse> updateVisitor(
      @PathVariable Integer id,
      @RequestBody VisitorRequestDto visitorRequest) {
    log.info("PUT /api/visitors/{} - Actualizando visitante", id);
    VisitorAPIResponse response = visitorService.updateVisitor(id, visitorRequest);

    if (response.getSuccess()) {
      return ResponseEntity.ok(response);
    } else {
      return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Eliminar visitante
   * Requiere rol ADMIN
   */
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<VisitorAPIResponse> deleteVisitor(@PathVariable Integer id) {
    log.info("DELETE /api/visitors/{} - Eliminando visitante", id);
    VisitorAPIResponse response = visitorService.deleteVisitor(id);

    if (response.getSuccess()) {
      return ResponseEntity.ok(response);
    } else {
      return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
  }
}
