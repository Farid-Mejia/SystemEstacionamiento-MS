package com.cibertec.application.service;

import com.cibertec.web.dto.VisitRequestDto;
import com.cibertec.web.dto.VisitResponseDto;

import java.util.List;

public interface VisitService {
    VisitResponseDto crear(VisitRequestDto visitRequestDto);
    List<VisitResponseDto> listarCompleto();
    VisitResponseDto buscarPorDni(String dni);
    VisitResponseDto buscarPorCodigo(int id);

}
