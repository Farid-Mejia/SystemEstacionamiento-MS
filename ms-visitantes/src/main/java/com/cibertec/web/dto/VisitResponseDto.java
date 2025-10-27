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
    private String first_name;
    private String paternal_last_name;
    private String maternal_last_name;


}
