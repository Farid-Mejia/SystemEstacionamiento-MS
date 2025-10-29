package com.cibertec.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VisitorResponseDto {

  private Integer id;
  private String dni;
  private String firstName;
  private String paternalLastName;
  private String maternalLastName;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
