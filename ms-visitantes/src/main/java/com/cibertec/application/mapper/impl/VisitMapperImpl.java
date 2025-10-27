package com.cibertec.application.mapper.impl;

import com.cibertec.application.mapper.VisitMapper;
import com.cibertec.domain.model.Visitante;
import com.cibertec.web.dto.VisitRequestDto;
import com.cibertec.web.dto.VisitResponseDto;
import org.springframework.stereotype.Component;


@Component
public class VisitMapperImpl implements VisitMapper {
    @Override
    public Visitante toDomain(VisitRequestDto visitRequestDto) {
        return Visitante.builder()
                .dni(visitRequestDto.getDni())
                .first_name(visitRequestDto.getFirst_name()) // Ajusta el nombre del campo de tu entidad
                .paternal_last_name(visitRequestDto.getPaternal_last_name()) // Ajusta el nombre
                .maternal_last_name(visitRequestDto.getMaternal_last_name()) // Ajusta el nombre
                .build();
    }

    @Override
    public VisitResponseDto toDto(Visitante visitante) {
        return VisitResponseDto.builder()
                .id(visitante.getId())
                .dni(visitante.getDni())
                .first_name(visitante.getFirst_name())
                .paternal_last_name(visitante.getPaternal_last_name())
                .maternal_last_name(visitante.getMaternal_last_name())
                .build();
    }
}
