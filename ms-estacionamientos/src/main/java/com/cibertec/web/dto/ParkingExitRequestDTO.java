package com.cibertec.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingExitRequestDTO {
    private String dni;
    private String license_plate;
}
