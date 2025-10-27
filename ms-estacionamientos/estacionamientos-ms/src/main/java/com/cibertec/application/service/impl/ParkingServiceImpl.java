package com.cibertec.application.service.impl;

import com.cibertec.application.client.VisitanteClient;
import com.cibertec.application.client.VisitanteResponseDTO;
import com.cibertec.application.mapper.ParkingMapper;
import com.cibertec.application.mapper.RecordMapper;
import com.cibertec.application.service.ParkingService;
import com.cibertec.domain.model.ParkingSpace;
import com.cibertec.domain.model.VehicleRecord;
import com.cibertec.domain.repository.ParkingRecordRepository;
import com.cibertec.domain.repository.ParkingSpaceRepository;
import com.cibertec.web.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ParkingServiceImpl implements ParkingService {

    private final ParkingSpaceRepository spaceRepository;
    private final ParkingRecordRepository recordRepository;
    private final ParkingMapper parkingMapper;
    private final RecordMapper recordMapper;
    private final VisitanteClient visitante;

    @Override
    public SpacesResponseDTO getAllSpaces() {
        List<ParkingSpace> spaces = spaceRepository.findAll();
        return parkingMapper.toSpacesResponseDto(spaces);
    }

    @Override
    public ParkingEntryResponseDTO registerEntry(ParkingEntryRequestDTO requestDTO) {
        // 1. Traer info del visitante
        VisitanteResponseDTO visitanteResponse;
        try {
            visitanteResponse = visitante.getVisitorByDni(requestDTO.getDni());
        } catch (Exception e) {
            throw new IllegalArgumentException("Visitante no encontrado con el DNI proporcionado");
        }

        // 2. Buscar y validar espacio
        ParkingSpace space = spaceRepository.findById(requestDTO.getParking_space_id())
                .orElseThrow(() -> new IllegalArgumentException("Parking space no encontrado"));
        if (!space.isAvailable()) {
            throw new IllegalArgumentException("El espacio seleccionado no está disponible");
        }

        // 3. Crear registro de vehículo
        VehicleRecord record = VehicleRecord.builder()
                .visitanteId((long) visitanteResponse.getDni().hashCode())
                .licensePlate(requestDTO.getLicense_plate())
                .model(requestDTO.getModel())
                .parkingSpace(space)
                .entryTime(LocalDateTime.now())
                .build();

        record = recordRepository.save(record);

        return recordMapper.toParkingEntryResponse(record, visitanteResponse);
    }

    @Override
    public ParkingExitResponseDTO registerExit(ParkingExitRequestDTO requestDTO) {
        // 1. Traer info del visitante
        VisitanteResponseDTO visitanteResponse;
        try {
            visitanteResponse = visitante.getVisitorByDni(requestDTO.getDni());
        } catch (Exception e) {
            throw new IllegalArgumentException("Visitante no encontrado con el DNI proporcionado");
        }

        // 2. Buscar registro activo por placa
        VehicleRecord record = recordRepository
                .findByLicensePlateAndExitTimeIsNull(requestDTO.getLicense_plate())
                .orElseThrow(() -> new IllegalArgumentException("No se encontró registro activo para la placa proporcionada"));

        // 3. Registrar salida
        LocalDateTime exitTime = LocalDateTime.now();
        record.setExitTime(exitTime);

        // 4. Calcular tiempo transcurrido y monto
        Duration duration = Duration.between(record.getEntryTime(), exitTime);
        int hoursElapsed = (int) Math.ceil(duration.toMinutes() / 60.0);
        double totalAmount = hoursElapsed * 5; // tarifa por hora

        recordRepository.save(record);

        return recordMapper.toParkingExitResponse(record, visitanteResponse, hoursElapsed, totalAmount);
    }
}
