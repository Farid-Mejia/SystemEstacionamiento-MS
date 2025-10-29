package com.cibertec.application.service.impl;

import com.cibertec.application.mapper.VisitorMapper;
import com.cibertec.application.service.VisitorService;
import com.cibertec.domain.model.Visitor;
import com.cibertec.domain.repository.VisitorRepository;
import com.cibertec.web.dto.VisitorAPIResponse;
import com.cibertec.web.dto.VisitorRequestDto;
import com.cibertec.web.dto.VisitorResponseDto;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisitorServiceImpl implements VisitorService {

  private final VisitorRepository visitorRepository;
  private final VisitorMapper visitorMapper;

  public VisitorServiceImpl(VisitorRepository visitorRepository, VisitorMapper visitorMapper) {
    this.visitorRepository = visitorRepository;
    this.visitorMapper = visitorMapper;
  }

  @Override
  @Transactional(readOnly = true)
  public VisitorAPIResponse getVisitorByDni(String dni) {
    System.out.println("Buscando visitante con DNI: " + dni);

    return visitorRepository.findByDni(dni)
        .map(visitor -> {
          VisitorResponseDto responseDto = visitorMapper.toResponseDto(visitor);
          return VisitorAPIResponse.builder()
              .success(true)
              .message("Visitante encontrado exitosamente")
              .data(responseDto)
              .build();
        })
        .orElseGet(() -> VisitorAPIResponse.builder()
            .success(false)
            .message("No se encontró visitante con DNI: " + dni)
            .data(null)
            .build());
  }

  @Override
  @Transactional
  public VisitorAPIResponse createVisitor(VisitorRequestDto requestDto) {
    System.out.println("Creando nuevo visitante con DNI: " + requestDto.getDni());

    // Verificar si ya existe un visitante con el mismo DNI
    if (visitorRepository.existsByDni(requestDto.getDni())) {
      return VisitorAPIResponse.builder()
          .success(false)
          .message("Ya existe un visitante con el DNI: " + requestDto.getDni())
          .data(null)
          .build();
    }

    Visitor visitor = visitorMapper.toEntity(requestDto);
    Visitor savedVisitor = visitorRepository.save(visitor);

    VisitorResponseDto responseDto = visitorMapper.toResponseDto(savedVisitor);

    return VisitorAPIResponse.builder()
        .success(true)
        .message("Visitante creado exitosamente")
        .data(responseDto)
        .build();
  }

  @Override
  @Transactional(readOnly = true)
  public List<VisitorAPIResponse> getAllVisitors() {
    System.out.println("Obteniendo todos los visitantes");

    return visitorRepository.findAll().stream()
        .map(visitor -> {
          VisitorResponseDto responseDto = visitorMapper.toResponseDto(visitor);
          return VisitorAPIResponse.builder()
              .success(true)
              .message("Visitante obtenido")
              .data(responseDto)
              .build();
        })
        .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public VisitorAPIResponse updateVisitor(Integer id, VisitorRequestDto requestDto) {
    System.out.println("Actualizando visitante con ID: " + id);

    return visitorRepository.findById(id)
        .map(existingVisitor -> {
          // Verificar si el DNI ya existe en otro visitante
          if (!existingVisitor.getDni().equals(requestDto.getDni()) &&
              visitorRepository.existsByDni(requestDto.getDni())) {
            return VisitorAPIResponse.builder()
                .success(false)
                .message("El DNI ya está registrado en otro visitante")
                .data(null)
                .build();
          }

          existingVisitor.setDni(requestDto.getDni());
          existingVisitor.setFirstName(requestDto.getFirstName());
          existingVisitor.setPaternalLastName(requestDto.getPaternalLastName());
          existingVisitor.setMaternalLastName(requestDto.getMaternalLastName());

          Visitor updatedVisitor = visitorRepository.save(existingVisitor);
          VisitorResponseDto responseDto = visitorMapper.toResponseDto(updatedVisitor);

          return VisitorAPIResponse.builder()
              .success(true)
              .message("Visitante actualizado exitosamente")
              .data(responseDto)
              .build();
        })
        .orElseGet(() -> VisitorAPIResponse.builder()
            .success(false)
            .message("No se encontró visitante con ID: " + id)
            .data(null)
            .build());
  }

  @Override
  @Transactional
  public VisitorAPIResponse deleteVisitor(Integer id) {
    System.out.println("Eliminando visitante con ID: " + id);

    return visitorRepository.findById(id)
        .map(visitor -> {
          visitorRepository.delete(visitor);
          VisitorResponseDto responseDto = visitorMapper.toResponseDto(visitor);

          return VisitorAPIResponse.builder()
              .success(true)
              .message("Visitante eliminado exitosamente")
              .data(responseDto)
              .build();
        })
        .orElseGet(() -> VisitorAPIResponse.builder()
            .success(false)
            .message("No se encontró visitante con ID: " + id)
            .data(null)
            .build());
  }
}
