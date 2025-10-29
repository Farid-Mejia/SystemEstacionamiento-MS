package com.cibertec.parkingspaces.service;

import com.cibertec.parkingspaces.dto.CreateParkingSpaceRequest;
import com.cibertec.parkingspaces.dto.UpdateParkingSpaceRequest;
import com.cibertec.parkingspaces.entity.ParkingSpace;
import com.cibertec.parkingspaces.repository.ParkingSpaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParkingSpaceService {

    @Autowired
    private ParkingSpaceRepository parkingSpaceRepository;

    // Obtener todos los espacios de estacionamiento
    public List<ParkingSpace> getAllParkingSpaces() {
        return parkingSpaceRepository.findAll();
    }

    // Obtener espacio por ID
    public Optional<ParkingSpace> getParkingSpaceById(Long id) {
        return parkingSpaceRepository.findById(id);
    }

    // Obtener espacio por número
    public Optional<ParkingSpace> getParkingSpaceByNumber(Integer spaceNumber) {
        return parkingSpaceRepository.findBySpaceNumber(spaceNumber);
    }

    // Crear nuevo espacio de estacionamiento
    public ParkingSpace createParkingSpace(CreateParkingSpaceRequest request) {
        // Verificar si ya existe un espacio con ese número
        if (parkingSpaceRepository.existsBySpaceNumber(request.getSpaceNumber())) {
            throw new RuntimeException("Ya existe un espacio con el número: " + request.getSpaceNumber());
        }

        ParkingSpace parkingSpace = new ParkingSpace();
        parkingSpace.setSpaceNumber(request.getSpaceNumber());
        parkingSpace.setFloor(request.getFloor());
        parkingSpace.setIsDisabledSpace(request.getIsDisabledSpace() != null ? request.getIsDisabledSpace() : false);
        parkingSpace.setStatus(request.getStatus() != null ? request.getStatus() : "available");

        return parkingSpaceRepository.save(parkingSpace);
    }

    // Actualizar espacio de estacionamiento
    public ParkingSpace updateParkingSpace(Long id, UpdateParkingSpaceRequest request) {
        Optional<ParkingSpace> optionalParkingSpace = parkingSpaceRepository.findById(id);
        
        if (optionalParkingSpace.isEmpty()) {
            throw new RuntimeException("Espacio de estacionamiento no encontrado con ID: " + id);
        }

        ParkingSpace parkingSpace = optionalParkingSpace.get();

        // Verificar si se está cambiando el número y si ya existe
        if (request.getSpaceNumber() != null && 
            !request.getSpaceNumber().equals(parkingSpace.getSpaceNumber()) &&
            parkingSpaceRepository.existsBySpaceNumber(request.getSpaceNumber())) {
            throw new RuntimeException("Ya existe un espacio con el número: " + request.getSpaceNumber());
        }

        // Actualizar campos si se proporcionan
        if (request.getSpaceNumber() != null) {
            parkingSpace.setSpaceNumber(request.getSpaceNumber());
        }
        if (request.getFloor() != null) {
            parkingSpace.setFloor(request.getFloor());
        }
        if (request.getIsDisabledSpace() != null) {
            parkingSpace.setIsDisabledSpace(request.getIsDisabledSpace());
        }
        if (request.getStatus() != null) {
            parkingSpace.setStatus(request.getStatus());
        }

        return parkingSpaceRepository.save(parkingSpace);
    }

    // Eliminar espacio de estacionamiento
    public void deleteParkingSpace(Long id) {
        if (!parkingSpaceRepository.existsById(id)) {
            throw new RuntimeException("Espacio de estacionamiento no encontrado con ID: " + id);
        }
        parkingSpaceRepository.deleteById(id);
    }

    // Filtrar espacios por criterios
    public List<ParkingSpace> filterParkingSpaces(String floor, String status, Boolean isDisabledSpace) {
        if (floor != null && status != null && isDisabledSpace != null) {
            return parkingSpaceRepository.findByFloorAndStatusAndIsDisabledSpace(floor, status, isDisabledSpace);
        } else if (floor != null && status != null) {
            return parkingSpaceRepository.findByFloorAndStatus(floor, status);
        } else if (status != null && isDisabledSpace != null) {
            return parkingSpaceRepository.findByStatusAndIsDisabledSpace(status, isDisabledSpace);
        } else if (floor != null) {
            return parkingSpaceRepository.findByFloor(floor);
        } else if (status != null) {
            return parkingSpaceRepository.findByStatus(status);
        } else if (isDisabledSpace != null) {
            return parkingSpaceRepository.findByIsDisabledSpace(isDisabledSpace);
        } else {
            return parkingSpaceRepository.findAll();
        }
    }

    // Obtener estadísticas
    public Long countByStatus(String status) {
        return parkingSpaceRepository.countByStatus(status);
    }

    public Long countByFloor(String floor) {
        return parkingSpaceRepository.countByFloor(floor);
    }

    // Actualizar solo el estado del espacio de estacionamiento
    public ParkingSpace updateParkingSpaceStatus(Long id, String status) {
        Optional<ParkingSpace> optionalParkingSpace = parkingSpaceRepository.findById(id);
        
        if (optionalParkingSpace.isEmpty()) {
            throw new RuntimeException("Espacio de estacionamiento no encontrado con ID: " + id);
        }

        ParkingSpace parkingSpace = optionalParkingSpace.get();
        parkingSpace.setStatus(status);

        return parkingSpaceRepository.save(parkingSpace);
    }
}