package com.hurtado.web.dto;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class VehiculoResponseDto {
    private Long id;
    private String placa;
    private String tipo;
    private String estado;
}
