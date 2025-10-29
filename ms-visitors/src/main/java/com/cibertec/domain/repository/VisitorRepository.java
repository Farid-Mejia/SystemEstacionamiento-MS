package com.cibertec.domain.repository;

import com.cibertec.domain.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Integer> {

  Optional<Visitor> findByDni(String dni);

  boolean existsByDni(String dni);
}
