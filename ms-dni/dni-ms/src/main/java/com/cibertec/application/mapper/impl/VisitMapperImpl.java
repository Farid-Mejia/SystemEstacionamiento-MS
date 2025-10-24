package com.cibertec.application.mapper.impl;

import com.cibertec.application.mapper.VisitMapper;
import com.cibertec.domain.model.Visitante;
import com.cibertec.web.dto.VisitRequestDto;
import com.cibertec.web.dto.VisitResponseDto;

public class VisitMapperImpl implements VisitMapper {
    @Override
    public Visitante toDomain(VisitRequestDto visitRequestDto) {
        return Visitante.builder()
                .dni(visitRequestDto.getDni())
                .build();
    }

    @Override
    public VisitResponseDto toDto(Visitante visitante) {
        return VisitResponseDto.builder()
                .id(visitante.getId())
                .dni(visitante.getDni())
                .priNombre(visitante.getPriNombre())
                .apePaterno(visitante.getApePaterno())
                .apeMaterno(visitante.getApeMaterno())
                .existe(visitante != null)// Se establece true si el visitante existe
                .registroActivo(visitante != null).build();
    }

}
