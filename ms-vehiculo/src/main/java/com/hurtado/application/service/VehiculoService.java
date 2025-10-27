package com.hurtado.application.service;

import com.hurtado.web.dto.VehiculoRequestDto;
import com.hurtado.web.dto.VehiculoResponseDto;
import java.util.List;

public interface VehiculoService {
    VehiculoResponseDto crear(VehiculoRequestDto vehiculoRequestDto);
    List<VehiculoResponseDto> listar();
    VehiculoResponseDto buscarPorPlaca(String placa);
    VehiculoResponseDto buscarPorId(Long id);
}
