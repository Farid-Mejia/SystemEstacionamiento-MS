package com.cibertec.application.service;

import com.cibertec.web.dto.*;


public interface ParkingService {
    SpacesResponseDTO getAllSpaces();
    ParkingEntryResponseDTO registerEntry(ParkingEntryRequestDTO requestDTO);
    ParkingExitResponseDTO registerExit(ParkingExitRequestDTO request);
}
