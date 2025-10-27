package com.cibertec.application.mapper;

import com.cibertec.application.client.VisitanteResponseDTO;
import com.cibertec.domain.model.VehicleRecord;
import com.cibertec.web.dto.ParkingEntryResponseDTO;
import com.cibertec.web.dto.ParkingExitResponseDTO;

public interface RecordMapper {
    ParkingEntryResponseDTO toParkingEntryResponse(VehicleRecord record, VisitanteResponseDTO visitante);
    ParkingExitResponseDTO toParkingExitResponse(VehicleRecord record, VisitanteResponseDTO visitor, int hoursElapsed, double totalAmount);
}
