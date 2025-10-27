package com.hurtado.domain.repository;

import com.hurtado.domain.model.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    Optional<Vehiculo> findByPlaca(String placa);
    Optional<Vehiculo> findById(Long id);
}
