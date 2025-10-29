package com.cibertec.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VisitorRequestDto {

  private String dni;
  private String firstName;
  private String paternalLastName;
  private String maternalLastName;
}
