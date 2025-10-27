package com.cibertec.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingEntryRequestDTO {
    private String dni;
    private String license_plate;
    private String model;
    private Long parking_space_id;
}
