package com.cibertec.application.mapper.impl;

import com.cibertec.application.mapper.VisitorMapper;
import com.cibertec.domain.model.Visitor;
import com.cibertec.web.dto.VisitorRequestDto;
import com.cibertec.web.dto.VisitorResponseDto;
import org.springframework.stereotype.Component;

@Component
public class VisitorMapperImpl implements VisitorMapper {

  @Override
  public Visitor toEntity(VisitorRequestDto requestDto) {
    if (requestDto == null) {
      return null;
    }

    return Visitor.builder()
        .dni(requestDto.getDni())
        .firstName(requestDto.getFirstName())
        .paternalLastName(requestDto.getPaternalLastName())
        .maternalLastName(requestDto.getMaternalLastName())
        .build();
  }

  @Override
  public VisitorResponseDto toResponseDto(Visitor visitor) {
    if (visitor == null) {
      return null;
    }

    return VisitorResponseDto.builder()
        .id(visitor.getId())
        .dni(visitor.getDni())
        .firstName(visitor.getFirstName())
        .paternalLastName(visitor.getPaternalLastName())
        .maternalLastName(visitor.getMaternalLastName())
        .createdAt(visitor.getCreatedAt())
        .updatedAt(visitor.getUpdatedAt())
        .build();
  }
}
