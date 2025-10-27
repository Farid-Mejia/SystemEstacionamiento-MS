package com.cibertec.web.dto;

import com.cibertec.application.client.VisitanteResponseDTO;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingExitResponseDTO {
    private Long id;
    private VisitanteResponseDTO visitor;
    private VehicleResponseDTO vehicle;
    private ParkingSpaceResponseDTO parking_space;
    private LocalDateTime entry_time;
    private LocalDateTime exit_time;
    private int time_elapsed_hours;
    private double total_amount;
}
