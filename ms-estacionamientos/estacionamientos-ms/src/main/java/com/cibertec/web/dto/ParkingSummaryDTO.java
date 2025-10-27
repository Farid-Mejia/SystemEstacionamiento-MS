package com.cibertec.web.dto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingSummaryDTO {
    private int total;
    private int available;
    private int occupied;
}
