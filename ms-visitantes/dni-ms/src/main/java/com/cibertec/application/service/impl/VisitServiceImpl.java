package com.cibertec.application.service.impl;

import com.cibertec.application.mapper.VisitMapper;
import com.cibertec.application.service.VisitService;
import com.cibertec.domain.repository.VisitanteRepository;
import com.cibertec.web.dto.VisitRequestDto;
import com.cibertec.web.dto.VisitResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitServiceImpl implements VisitService {
    private final VisitanteRepository visitanteRepository; /*los metodos que si conectan con la BD*/
    private final VisitMapper visitMapper; /*los metodos para la traduccion correspondiente*/

    @Override
    public VisitResponseDto crear(VisitRequestDto visitRequestDto) {
        return null;
    }

    @Override
    public List<VisitResponseDto> listarCompleto() {
        return List.of();
    }

    @Override
    public VisitResponseDto buscarPorDni(String dni) {
        return null;
    }

    @Override
    public VisitResponseDto buscarPorCodigo(int id) {
        return null;
    }

}
