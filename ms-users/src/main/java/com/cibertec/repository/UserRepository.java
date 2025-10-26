package com.cibertec.repository;

import com.cibertec.entity.Role;
import com.cibertec.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Buscar usuario por username
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Buscar usuario por DNI
     */
    Optional<User> findByDni(String dni);
    
    /**
     * Verificar si existe un usuario con el username dado
     */
    boolean existsByUsername(String username);
    
    /**
     * Verificar si existe un usuario con el DNI dado
     */
    boolean existsByDni(String dni);
    
    /**
     * Buscar usuarios por rol
     */
    List<User> findByRole(Role role);
    
    /**
     * Buscar usuarios por nombre (first_name)
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :firstName, '%'))")
    List<User> findByFirstNameContainingIgnoreCase(@Param("firstName") String firstName);
    
    /**
     * Buscar usuarios por apellido paterno
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.paternalLastName) LIKE LOWER(CONCAT('%', :paternalLastName, '%'))")
    List<User> findByPaternalLastNameContainingIgnoreCase(@Param("paternalLastName") String paternalLastName);
    
    /**
     * Buscar usuarios activos (para futuras implementaciones)
     */
    @Query("SELECT u FROM User u WHERE u.id IS NOT NULL ORDER BY u.createdAt DESC")
    List<User> findAllActiveUsers();
    
    /**
     * Contar usuarios por rol
     */
    long countByRole(Role role);
}