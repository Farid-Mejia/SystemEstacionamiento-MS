package com.cibertec.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VisitorAPIResponse {

  private Boolean success;
  private String message;
  private VisitorResponseDto data;
}
