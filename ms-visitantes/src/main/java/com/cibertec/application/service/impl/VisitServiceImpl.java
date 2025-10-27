package com.cibertec.application.service.impl;

import com.cibertec.application.mapper.VisitMapper;
import com.cibertec.application.service.VisitService;
import com.cibertec.domain.model.Visitante;
import com.cibertec.domain.repository.VisitanteRepository;
import com.cibertec.web.dto.VisitAPIResponse;
import com.cibertec.web.dto.VisitRequestDto;
import com.cibertec.web.dto.VisitResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VisitServiceImpl implements VisitService {
    private final VisitMapper visitMapper;
    private final VisitanteRepository visitanteRepository;



    @Override
    public VisitAPIResponse buscarPorDni(String dni) {
        Visitante visitanteEncontrado = visitanteRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Visitante no encontrado con el DNI proporcionado: " + dni));
        // ^^^ Puedes usar tu propia excepción personalizada aquí

        // 2. Usamos el Mapper para "traducir" la Entidad al DTO interno
        VisitResponseDto visitDto = visitMapper.toDto(visitanteEncontrado);

        // 3. ¡AQUÍ ESTÁ LA CLAVE!
        // Creamos la respuesta final (el objeto externo) y le pasamos el DTO interno
        VisitAPIResponse apiResponse = new VisitAPIResponse(
                true,
                "Visitante encontrado",
                visitDto // ¡Aquí anidamos el DTO!
        );

        // 4. Devolvemos la respuesta completa
        return apiResponse;
    }

    @Override
    public VisitAPIResponse crearVisitante(VisitRequestDto visitRequestDto) {

        // 1. Validar si el DNI ya existe
        if (visitanteRepository.findByDni(visitRequestDto.getDni()).isPresent()) {
            // Esto es una simplificación; en producción deberías usar una Custom Exception
            throw new RuntimeException("El DNI " + visitRequestDto.getDni() + " ya está registrado.");
        }
        // 2. Mapear DTO de Request a Entidad de Dominio
        Visitante nuevoVisitante = visitMapper.toDomain(visitRequestDto);

        // 3. GUARDAR: Persistir la entidad.
        // ¡La fecha created_at se genera automáticamente por @CreationTimestamp!
        Visitante visitanteGuardado = visitanteRepository.save(nuevoVisitante);

        // 4. Mapear Entidad guardada a DTO de Respuesta
        VisitResponseDto visitanteDto = visitMapper.toDto(visitanteGuardado);

        // 5. Devolver Respuesta de Éxito
        return new VisitAPIResponse(
                true,
                "Visitante creado exitosamente",
                visitanteDto
        );

    }


}
