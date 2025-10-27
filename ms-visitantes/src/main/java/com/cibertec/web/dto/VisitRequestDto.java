package com.cibertec.web.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VisitRequestDto {
    /* los valores que van a salir, que le piden*/

    private String dni;

    private String first_name;
    private String paternal_last_name;
    private String maternal_last_name;
    /*
    private boolean existe;
    private boolean registroActivo;*/



}
