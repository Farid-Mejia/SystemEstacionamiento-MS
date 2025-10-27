package com.cibertec.domain.repository;

import com.cibertec.domain.model.VehicleRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParkingRecordRepository extends JpaRepository <VehicleRecord, Long>{
    Optional<VehicleRecord> findByLicensePlateAndExitTimeIsNull(String licensePlate);
    Optional<VehicleRecord> findByVisitanteIdAndExitTimeIsNull(Long visitanteId);
}
