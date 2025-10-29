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

  // Métodos adicionales para compatibilidad
  public String getDni() {
    return dni;
  }

  public void setDni(String dni) {
    this.dni = dni;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getPaternalLastName() {
    return paternalLastName;
  }

  public void setPaternalLastName(String paternalLastName) {
    this.paternalLastName = paternalLastName;
  }

  public String getMaternalLastName() {
    return maternalLastName;
  }

  public void setMaternalLastName(String maternalLastName) {
    this.maternalLastName = maternalLastName;
  }
}
