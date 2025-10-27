package com.cibertec.web.controller;


import com.cibertec.application.service.VisitService;
import com.cibertec.web.dto.VisitAPIResponse;
import com.cibertec.web.dto.VisitRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/visitors/dni/")
@RequiredArgsConstructor
public class VisitanteControlador {

    private final VisitService visitanteService;

    @GetMapping("/{dni}")
    public ResponseEntity<VisitAPIResponse> getVisitorByDni(@PathVariable String dni) {

        // 1. Llamamos al servicio
        // El servicio ya nos devuelve el objeto COMPLETO (VisitorApiResponse)
        VisitAPIResponse response = visitanteService.buscarPorDni(dni);

        // 2. Devolvemos la respuesta
        // Spring se encargará de convertir 'response' al JSON anidado
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<VisitAPIResponse> crearVisitante(@RequestBody VisitRequestDto visitorRequest) {

        // 1. Llamar al Service para ejecutar la lógica de creación
        VisitAPIResponse response = visitanteService.crearVisitante(visitorRequest);

        // 2. Devolver la respuesta con el código HTTP 201 CREATED
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

}
