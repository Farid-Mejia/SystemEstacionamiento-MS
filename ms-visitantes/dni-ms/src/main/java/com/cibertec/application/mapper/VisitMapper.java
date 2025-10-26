package com.cibertec.application.mapper;

import com.cibertec.domain.model.Visitante;
import com.cibertec.web.dto.VisitRequestDto;
import com.cibertec.web.dto.VisitResponseDto;

public interface VisitMapper {
/*Basicamente, la conexion de Request(en caso de que se vaya a crear algo nuevo)
 a la entidad, por que la entidad es la que tiene la conexion a BD y no el Request*/

    Visitante toDomain(VisitRequestDto visitRequestDto);

    VisitResponseDto toDto (Visitante visitante);



}
