package com.cibertec.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "visitantes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Visitante {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String dni;
    private String priNombre;
    private String apePaterno;
    private String apeMaterno;

    private Timestamp tiempoCreado;
    private Timestamp tiempoActualizado;



}
