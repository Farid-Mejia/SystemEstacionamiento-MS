package com.cibertec.application.mapper.impl;

import com.cibertec.application.client.VisitanteResponseDTO;
import com.cibertec.application.mapper.RecordMapper;
import com.cibertec.domain.model.VehicleRecord;
import com.cibertec.web.dto.ParkingEntryResponseDTO;
import com.cibertec.web.dto.ParkingExitResponseDTO;
import com.cibertec.web.dto.ParkingSpaceResponseDTO;
import com.cibertec.web.dto.VehicleResponseDTO;

public class RecordMapperImpl implements RecordMapper {
    @Override
    public ParkingEntryResponseDTO toParkingEntryResponse(VehicleRecord record, VisitanteResponseDTO visitante) {
        return new ParkingEntryResponseDTO(
                record.getId(),
                visitante,
                new VehicleResponseDTO(record.getLicensePlate(), record.getModel()),
                new ParkingSpaceResponseDTO(
                        record.getParkingSpace().getId(),
                        record.getParkingSpace().getSpaceCode(),
                        record.getParkingSpace().getFloorLevel(),
                        record.getParkingSpace().isAvailable()
                ),
                record.getEntryTime()
        );
    }

    @Override
    public ParkingExitResponseDTO toParkingExitResponse(VehicleRecord record, VisitanteResponseDTO visitor, int hoursElapsed, double totalAmount) {
        return new ParkingExitResponseDTO(
                record.getId(),
                visitor,
                new VehicleResponseDTO(record.getLicensePlate(), record.getModel()),
                new ParkingSpaceResponseDTO(
                        record.getParkingSpace().getId(),
                        record.getParkingSpace().getSpaceCode(),
                        record.getParkingSpace().getFloorLevel(),
                        record.getParkingSpace().isAvailable()
                ),
                record.getEntryTime(),
                record.getExitTime(),
                hoursElapsed,
                totalAmount
        );
    }
}
