package com.cibertec.domain.repository;

import com.cibertec.domain.model.Visitante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VisitanteRepository extends JpaRepository<Visitante, Integer> {
    Optional<Visitante> findByDniVisitante(String dni);

}
