package com.cibertec.web.dto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingSpaceResponseDTO {
    private Long id;
    private String spaceCode;
    private String floorLevel;
    private boolean isAvailable;
}
