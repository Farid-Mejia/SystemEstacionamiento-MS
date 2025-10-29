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

  public static VisitorResponseDtoBuilder builder() {
    return new VisitorResponseDtoBuilder();
  }

  public static class VisitorResponseDtoBuilder {
    private Integer id;
    private String dni;
    private String firstName;
    private String paternalLastName;
    private String maternalLastName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public VisitorResponseDtoBuilder id(Integer id) {
      this.id = id;
      return this;
    }

    public VisitorResponseDtoBuilder dni(String dni) {
      this.dni = dni;
      return this;
    }

    public VisitorResponseDtoBuilder firstName(String firstName) {
      this.firstName = firstName;
      return this;
    }

    public VisitorResponseDtoBuilder paternalLastName(String paternalLastName) {
      this.paternalLastName = paternalLastName;
      return this;
    }

    public VisitorResponseDtoBuilder maternalLastName(String maternalLastName) {
      this.maternalLastName = maternalLastName;
      return this;
    }

    public VisitorResponseDtoBuilder createdAt(LocalDateTime createdAt) {
      this.createdAt = createdAt;
      return this;
    }

    public VisitorResponseDtoBuilder updatedAt(LocalDateTime updatedAt) {
      this.updatedAt = updatedAt;
      return this;
    }

    public VisitorResponseDto build() {
      VisitorResponseDto dto = new VisitorResponseDto();
      dto.id = this.id;
      dto.dni = this.dni;
      dto.firstName = this.firstName;
      dto.paternalLastName = this.paternalLastName;
      dto.maternalLastName = this.maternalLastName;
      dto.createdAt = this.createdAt;
      dto.updatedAt = this.updatedAt;
      return dto;
    }
  }
}
