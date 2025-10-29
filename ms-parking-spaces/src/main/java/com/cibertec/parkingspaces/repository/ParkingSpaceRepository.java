package com.cibertec.parkingspaces.repository;

import com.cibertec.parkingspaces.entity.ParkingSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSpaceRepository extends JpaRepository<ParkingSpace, Long> {

    // Buscar por número de espacio
    Optional<ParkingSpace> findBySpaceNumber(Integer spaceNumber);

    // Buscar por piso
    List<ParkingSpace> findByFloor(String floor);

    // Buscar por estado
    List<ParkingSpace> findByStatus(String status);

    // Buscar espacios para discapacitados
    List<ParkingSpace> findByIsDisabledSpace(Boolean isDisabledSpace);

    // Buscar por piso y estado
    List<ParkingSpace> findByFloorAndStatus(String floor, String status);

    // Buscar por estado y espacios para discapacitados
    List<ParkingSpace> findByStatusAndIsDisabledSpace(String status, Boolean isDisabledSpace);

    // Buscar por piso, estado y espacios para discapacitados
    List<ParkingSpace> findByFloorAndStatusAndIsDisabledSpace(String floor, String status, Boolean isDisabledSpace);

    // Contar espacios por estado
    @Query("SELECT COUNT(p) FROM ParkingSpace p WHERE p.status = :status")
    Long countByStatus(@Param("status") String status);

    // Contar espacios por piso
    @Query("SELECT COUNT(p) FROM ParkingSpace p WHERE p.floor = :floor")
    Long countByFloor(@Param("floor") String floor);

    // Verificar si existe un espacio con el número dado
    boolean existsBySpaceNumber(Integer spaceNumber);
}