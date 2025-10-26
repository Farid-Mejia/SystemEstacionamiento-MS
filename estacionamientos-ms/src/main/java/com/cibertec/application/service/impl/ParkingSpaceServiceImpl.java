package com.cibertec.application.service.impl;

import com.cibertec.application.mapper.ParkingMapper;
import com.cibertec.application.service.ParkingSpaceService;
import com.cibertec.domain.model.ParkingSpace;
import com.cibertec.domain.repository.ParkingSpaceRepository;
import com.cibertec.web.dto.SpacesResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParkingSpaceServiceImpl implements ParkingSpaceService {
    private final ParkingSpaceRepository repository;
    private final ParkingMapper mapper;

    @Override
    public SpacesResponseDTO getAllSpaces() {
        List<ParkingSpace> spaces = repository.findAll();
        return mapper.toSpacesResponseDto(spaces);
    }
}
