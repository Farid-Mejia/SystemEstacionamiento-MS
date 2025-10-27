package com.cibertec.application.client;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitanteResponseDTO {
    private int id;
    private String dni;
    private String firstName;
    private String paternalLastName;
    private String maternalLastName;
}
