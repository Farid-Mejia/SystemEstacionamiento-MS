package com.cibertec.web.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VisitResponseDto {
    /* los valores que van a salir, que le piden*/
    private int id;
    private String dni;

    private String priNombre;
    private String apePaterno;
    private String apeMaterno;

    private boolean existe;
    private boolean registroActivo;

}
