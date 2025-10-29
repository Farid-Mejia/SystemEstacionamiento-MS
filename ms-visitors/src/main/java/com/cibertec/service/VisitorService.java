package com.cibertec.service;

import com.cibertec.dto.VisitorRequest;
import com.cibertec.dto.VisitorResponse;
import com.cibertec.entity.Visitor;
import com.cibertec.repository.VisitorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class VisitorService {

    private static final Logger logger = LoggerFactory.getLogger(VisitorService.class);

    @Autowired
    private VisitorRepository visitorRepository;

    /**
     * Crear un nuevo visitante
     */
    public VisitorResponse createVisitor(VisitorRequest request) {
        logger.info("Creando nuevo visitante con DNI: {}", request.getDni());

        // Verificar si ya existe un visitante con el mismo DNI
        if (visitorRepository.existsByDni(request.getDni())) {
            throw new RuntimeException("Ya existe un visitante con el DNI: " + request.getDni());
        }

        Visitor visitor = new Visitor(
                request.getDni(),
                request.getFirstName(),
                request.getPaternalLastName(),
                request.getMaternalLastName()
        );

        Visitor savedVisitor = visitorRepository.save(visitor);
        logger.info("Visitante creado exitosamente con ID: {}", savedVisitor.getId());

        return new VisitorResponse(savedVisitor);
    }

    /**
     * Obtener visitante por ID
     */
    @Transactional(readOnly = true)
    public VisitorResponse getVisitorById(Long id) {
        logger.info("Buscando visitante por ID: {}", id);

        Optional<Visitor> visitor = visitorRepository.findById(id);
        if (visitor.isEmpty()) {
            throw new RuntimeException("Visitante no encontrado con ID: " + id);
        }

        return new VisitorResponse(visitor.get());
    }

    /**
     * Obtener visitante por DNI
     */
    @Transactional(readOnly = true)
    public VisitorResponse getVisitorByDni(String dni) {
        logger.info("Buscando visitante por DNI: {}", dni);

        Optional<Visitor> visitor = visitorRepository.findByDni(dni);
        if (visitor.isEmpty()) {
            throw new RuntimeException("Visitante no encontrado con DNI: " + dni);
        }

        return new VisitorResponse(visitor.get());
    }

    /**
     * Obtener todos los visitantes
     */
    @Transactional(readOnly = true)
    public List<VisitorResponse> getAllVisitors() {
        logger.info("Obteniendo todos los visitantes");

        List<Visitor> visitors = visitorRepository.findAllByOrderByCreatedAtDesc();
        return visitors.stream()
                .map(VisitorResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Buscar visitantes por nombre
     */
    @Transactional(readOnly = true)
    public List<VisitorResponse> searchVisitorsByName(String name) {
        logger.info("Buscando visitantes por nombre: {}", name);

        List<Visitor> visitors = visitorRepository.findByNameContaining(name);
        return visitors.stream()
                .map(VisitorResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Actualizar visitante
     */
    public VisitorResponse updateVisitor(Long id, VisitorRequest request) {
        logger.info("Actualizando visitante con ID: {}", id);

        Optional<Visitor> existingVisitor = visitorRepository.findById(id);
        if (existingVisitor.isEmpty()) {
            throw new RuntimeException("Visitante no encontrado con ID: " + id);
        }

        Visitor visitor = existingVisitor.get();

        // Verificar si el DNI ya existe en otro visitante
        if (!visitor.getDni().equals(request.getDni()) && visitorRepository.existsByDni(request.getDni())) {
            throw new RuntimeException("Ya existe otro visitante con el DNI: " + request.getDni());
        }

        // Actualizar campos
        visitor.setDni(request.getDni());
        visitor.setFirstName(request.getFirstName());
        visitor.setPaternalLastName(request.getPaternalLastName());
        visitor.setMaternalLastName(request.getMaternalLastName());

        Visitor updatedVisitor = visitorRepository.save(visitor);
        logger.info("Visitante actualizado exitosamente con ID: {}", updatedVisitor.getId());

        return new VisitorResponse(updatedVisitor);
    }

    /**
     * Eliminar visitante
     */
    public void deleteVisitor(Long id) {
        logger.info("Eliminando visitante con ID: {}", id);

        if (!visitorRepository.existsById(id)) {
            throw new RuntimeException("Visitante no encontrado con ID: " + id);
        }

        visitorRepository.deleteById(id);
        logger.info("Visitante eliminado exitosamente con ID: {}", id);
    }

    /**
     * Verificar si existe un visitante por DNI
     */
    @Transactional(readOnly = true)
    public boolean existsByDni(String dni) {
        return visitorRepository.existsByDni(dni);
    }

    /**
     * Obtener visitantes por apellido paterno
     */
    @Transactional(readOnly = true)
    public List<VisitorResponse> getVisitorsByPaternalLastName(String paternalLastName) {
        logger.info("Buscando visitantes por apellido paterno: {}", paternalLastName);

        List<Visitor> visitors = visitorRepository.findByPaternalLastNameContainingIgnoreCase(paternalLastName);
        return visitors.stream()
                .map(VisitorResponse::new)
                .collect(Collectors.toList());
    }
}