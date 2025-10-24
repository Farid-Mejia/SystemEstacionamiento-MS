package com.cibertec.web.dto;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VisitRequestDto {
    /* los valores que van a salir, que le piden*/

    private String dni;
    private boolean existe;
    private boolean registroActivo;



}
