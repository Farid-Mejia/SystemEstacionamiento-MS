package com.hurtado.application.mapper.impl;

import com.hurtado.application.mapper.VehiculoMapper;
import com.hurtado.domain.model.Vehiculo;
import com.hurtado.domain.model.EstadoVehiculo;
import com.hurtado.web.dto.VehiculoRequestDto;
import com.hurtado.web.dto.VehiculoResponseDto;
import org.springframework.stereotype.Component;

@Component
public class VehiculoMapperImpl implements VehiculoMapper {
    @Override
    public Vehiculo toDomain(VehiculoRequestDto vehiculoRequestDto) {
        EstadoVehiculo estadoVehiculo = EstadoVehiculo.DISPONIBLE;

        if (vehiculoRequestDto.getEstado() != null && !vehiculoRequestDto.getEstado().isEmpty()) {
            try {
                estadoVehiculo = EstadoVehiculo.valueOf(vehiculoRequestDto.getEstado().toUpperCase());
            } catch (IllegalArgumentException e) {
                estadoVehiculo = EstadoVehiculo.DISPONIBLE;
            }
        }

        return Vehiculo.builder()
                .placa(vehiculoRequestDto.getPlaca())
                .tipo(vehiculoRequestDto.getTipo())
                .estado(estadoVehiculo)
                .build();
    }

    @Override
    public VehiculoResponseDto toDto(Vehiculo vehiculo) {
        return VehiculoResponseDto.builder()
                .id(vehiculo.getId())
                .placa(vehiculo.getPlaca())
                .tipo(vehiculo.getTipo())
                .estado(vehiculo.getEstado().name())
                .build();
    }
}
