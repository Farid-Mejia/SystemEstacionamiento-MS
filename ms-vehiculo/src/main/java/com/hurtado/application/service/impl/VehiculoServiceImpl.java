package com.hurtado.application.service.impl;

import com.hurtado.application.mapper.VehiculoMapper;
import com.hurtado.application.service.VehiculoService;
import com.hurtado.domain.model.Vehiculo;
import com.hurtado.domain.repository.VehiculoRepository;
import com.hurtado.web.dto.VehiculoRequestDto;
import com.hurtado.web.dto.VehiculoResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehiculoServiceImpl implements VehiculoService {
    private final VehiculoRepository vehiculoRepository;
    private final VehiculoMapper vehiculoMapper;

    @Override
    public VehiculoResponseDto crear(VehiculoRequestDto vehiculoRequestDto) {
        Vehiculo vehiculo = vehiculoMapper.toDomain(vehiculoRequestDto);
        Vehiculo vehiculoRegistrado = vehiculoRepository.save(vehiculo);
        VehiculoResponseDto vehiculoResponseDto = vehiculoMapper.toDto(vehiculoRegistrado);
        return vehiculoResponseDto;
    }

    @Override
    public List<VehiculoResponseDto> listar() {
        return vehiculoRepository.findAll().stream()
                .map(vehiculoMapper::toDto)
                .toList();
    }

    @Override
    public VehiculoResponseDto buscarPorPlaca(String placa) {
        return vehiculoRepository.findByPlaca(placa)
                .map(vehiculoMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));
    }

    @Override
    public VehiculoResponseDto buscarPorId(Long id) {
        return vehiculoRepository.findById(id)
                .map(vehiculoMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado con ID: " + id));
    }
}
