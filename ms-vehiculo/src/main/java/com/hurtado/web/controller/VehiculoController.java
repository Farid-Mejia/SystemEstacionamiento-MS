package com.hurtado.web.controller;

import com.hurtado.application.service.VehiculoService;
import com.hurtado.web.dto.VehiculoRequestDto;
import com.hurtado.web.dto.VehiculoResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hurtado/vehiculo")
@RequiredArgsConstructor
public class VehiculoController {
    private final VehiculoService vehiculoService;

    @PostMapping
    public ResponseEntity<VehiculoResponseDto> crear(@RequestBody VehiculoRequestDto vehiculoRequestDto){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vehiculoService.crear(vehiculoRequestDto));
    }

    @GetMapping
    public ResponseEntity<List<VehiculoResponseDto>> listar(){
        return ResponseEntity.ok(vehiculoService.listar());
    }

    @GetMapping("/placa/{placa}")
    public ResponseEntity<VehiculoResponseDto> buscarPorPlaca(@PathVariable String placa){
        return ResponseEntity.ok(vehiculoService.buscarPorPlaca(placa));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehiculoResponseDto> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(vehiculoService.buscarPorId(id));
    }
}
