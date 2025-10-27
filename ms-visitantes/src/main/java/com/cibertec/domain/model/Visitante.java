package com.cibertec.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;

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
    private String first_name;
    private String paternal_last_name;
    private String maternal_last_name;

    @CreationTimestamp // ¡ESTA ES LA CLAVE! Se establece al momento de la inserción.
    private LocalDateTime created_at;

    @UpdateTimestamp // Se actualiza cada vez que el registro cambia.
    private LocalDateTime updated_at;



}
