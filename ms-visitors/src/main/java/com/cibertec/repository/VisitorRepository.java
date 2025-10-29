package com.cibertec.repository;

import com.cibertec.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    /**
     * Buscar visitante por DNI
     */
    Optional<Visitor> findByDni(String dni);

    /**
     * Verificar si existe un visitante con el DNI especificado
     */
    boolean existsByDni(String dni);

    /**
     * Buscar visitantes por nombre (búsqueda parcial)
     */
    @Query("SELECT v FROM Visitor v WHERE " +
           "LOWER(v.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR " +
           "LOWER(v.paternalLastName) LIKE LOWER(CONCAT('%', :name, '%')) OR " +
           "LOWER(v.maternalLastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Visitor> findByNameContaining(@Param("name") String name);

    /**
     * Buscar visitantes por apellido paterno
     */
    List<Visitor> findByPaternalLastNameContainingIgnoreCase(String paternalLastName);

    /**
     * Buscar visitantes por apellido materno
     */
    List<Visitor> findByMaternalLastNameContainingIgnoreCase(String maternalLastName);

    /**
     * Buscar visitantes por nombre completo (búsqueda exacta)
     */
    @Query("SELECT v FROM Visitor v WHERE " +
           "LOWER(v.firstName) = LOWER(:firstName) AND " +
           "LOWER(v.paternalLastName) = LOWER(:paternalLastName) AND " +
           "LOWER(v.maternalLastName) = LOWER(:maternalLastName)")
    List<Visitor> findByFullName(@Param("firstName") String firstName,
                                @Param("paternalLastName") String paternalLastName,
                                @Param("maternalLastName") String maternalLastName);

    /**
     * Obtener todos los visitantes ordenados por fecha de creación (más recientes primero)
     */
    List<Visitor> findAllByOrderByCreatedAtDesc();
}