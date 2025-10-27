package com.cibertec.application.service;

import com.cibertec.web.dto.VisitAPIResponse;
import com.cibertec.web.dto.VisitRequestDto;
import com.cibertec.web.dto.VisitResponseDto;

import java.util.List;

public interface VisitService {
    VisitAPIResponse crearVisitante(VisitRequestDto visitRequestDto);
    //List<VisitResponseDto> listarCompleto();
    VisitAPIResponse buscarPorDni(String dni);
    //VisitResponseDto buscarPorCodigo(int id);


}
