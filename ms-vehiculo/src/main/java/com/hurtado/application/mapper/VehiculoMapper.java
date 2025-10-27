package com.hurtado.application.mapper;

import com.hurtado.domain.model.Vehiculo;
import com.hurtado.web.dto.VehiculoRequestDto;
import com.hurtado.web.dto.VehiculoResponseDto;

public interface VehiculoMapper {
    Vehiculo toDomain(VehiculoRequestDto vehiculoRequestDto);
    VehiculoResponseDto toDto(Vehiculo vehiculo);
}
