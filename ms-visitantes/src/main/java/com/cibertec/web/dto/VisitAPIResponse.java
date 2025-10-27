package com.cibertec.web.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VisitAPIResponse {
    private boolean success;
    private String message;

    // Aquí está la anidación:
    // Este campo 'visitor' contendrá el DTO interno
    private VisitResponseDto visitor;
}
