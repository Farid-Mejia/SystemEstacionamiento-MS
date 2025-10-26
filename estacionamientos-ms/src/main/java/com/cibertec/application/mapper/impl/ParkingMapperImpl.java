package com.cibertec.application.mapper.impl;

import com.cibertec.application.mapper.ParkingMapper;
import com.cibertec.domain.model.ParkingSpace;
import com.cibertec.web.dto.ParkingSpaceResponseDTO;
import com.cibertec.web.dto.ParkingSummaryDTO;
import com.cibertec.web.dto.SpacesResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ParkingMapperImpl implements ParkingMapper {
    @Override
    public SpacesResponseDTO toSpacesResponseDto(List<ParkingSpace> spaces) {
        List<ParkingSpaceResponseDTO> spaceDTOs = spaces.stream()
                .map(space -> ParkingSpaceResponseDTO.builder()
                        .id(space.getId())
                        .spaceCode(space.getSpaceCode())
                        .floorLevel(space.getFloorLevel())
                        .isAvailable(space.isAvailable())
                        .build())
                .toList();

        List<ParkingSpaceResponseDTO> ssSpaces = spaceDTOs.stream()
                .filter(s -> s.getFloorLevel().equalsIgnoreCase("SS"))
                .toList();
        List<ParkingSpaceResponseDTO> s1Spaces = spaceDTOs.stream()
                .filter(s -> s.getFloorLevel().equalsIgnoreCase("S1"))
                .toList();

        int total = spaces.size();
        int available = (int) spaces.stream().filter(ParkingSpace::isAvailable).count();
        int occupied = total - available;

        return SpacesResponseDTO.builder()
                .success(true)
                .message("Espacios de estacionamientos obtenidos")
                .spaces(spaceDTOs)
                .ssSpaces(ssSpaces)
                .s1Spaces(s1Spaces)
                .summary(ParkingSummaryDTO.builder()
                        .total(total)
                        .available(available)
                        .occupied(occupied)
                        .build())
                .build();
    }

}
