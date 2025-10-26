package com.cibertec.application.mapper;

import com.cibertec.domain.model.ParkingSpace;
import com.cibertec.web.dto.SpacesResponseDTO;

import java.util.List;

public interface ParkingMapper {
    SpacesResponseDTO toSpacesResponseDto (List<ParkingSpace> spaces);
}
