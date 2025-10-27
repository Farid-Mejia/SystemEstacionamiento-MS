package com.hurtado.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehiculos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vehiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String placa;
    private String tipo;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private EstadoVehiculo estado = EstadoVehiculo.DISPONIBLE;
}
