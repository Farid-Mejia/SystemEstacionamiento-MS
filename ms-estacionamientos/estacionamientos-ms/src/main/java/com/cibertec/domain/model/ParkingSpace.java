package com.cibertec.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table (name = "parking_spaces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParkingSpace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "space_code")
    private String spaceCode;
    @Column(name = "floor_level")
    private String floorLevel;
    @Column(name = "is_available")
    private boolean isAvailable;
}
