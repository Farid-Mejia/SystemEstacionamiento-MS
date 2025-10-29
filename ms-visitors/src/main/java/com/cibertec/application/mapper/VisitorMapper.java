package com.cibertec.application.mapper;

import com.cibertec.domain.model.Visitor;
import com.cibertec.web.dto.VisitorRequestDto;
import com.cibertec.web.dto.VisitorResponseDto;

public interface VisitorMapper {

  Visitor toEntity(VisitorRequestDto requestDto);

  VisitorResponseDto toResponseDto(Visitor visitor);
}
