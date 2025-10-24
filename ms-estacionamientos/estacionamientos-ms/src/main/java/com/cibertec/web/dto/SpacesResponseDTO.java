package com.cibertec.web.dto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpacesResponseDTO {
    private boolean success;
    private String message;
    private List<ParkingSpaceResponseDTO> spaces;
    private List<ParkingSpaceResponseDTO> ssSpaces;
    private List<ParkingSpaceResponseDTO> s1Spaces;
    private ParkingSummaryDTO summary;
}
