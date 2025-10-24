package com.cibertec.web.controller;

import com.cibertec.application.service.ParkingSpaceService;
import com.cibertec.web.dto.SpacesResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/parking")
@RequiredArgsConstructor
public class ParkingSpaceController {
    private final ParkingSpaceService service;

    @GetMapping("/spaces")
    public ResponseEntity<SpacesResponseDTO> listar(){
        SpacesResponseDTO responseSDTO = service.getAllSpaces();
        return ResponseEntity.ok(responseSDTO);
    }
}
