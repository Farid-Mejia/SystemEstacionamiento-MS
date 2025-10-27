package com.hurtado.web.dto;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor @Builder
public class VehiculoRequestDto {
    private String placa;
    private String tipo;
    private String estado;
}
