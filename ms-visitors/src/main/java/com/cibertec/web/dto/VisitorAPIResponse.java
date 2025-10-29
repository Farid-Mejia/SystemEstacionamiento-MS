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

  // Métodos adicionales para compatibilidad
  public Boolean getSuccess() {
    return success;
  }

  public void setSuccess(Boolean success) {
    this.success = success;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public VisitorResponseDto getData() {
    return data;
  }

  public void setData(VisitorResponseDto data) {
    this.data = data;
  }

  public static VisitorAPIResponseBuilder builder() {
    return new VisitorAPIResponseBuilder();
  }

  public static class VisitorAPIResponseBuilder {
    private Boolean success;
    private String message;
    private VisitorResponseDto data;

    public VisitorAPIResponseBuilder success(Boolean success) {
      this.success = success;
      return this;
    }

    public VisitorAPIResponseBuilder message(String message) {
      this.message = message;
      return this;
    }

    public VisitorAPIResponseBuilder data(VisitorResponseDto data) {
      this.data = data;
      return this;
    }

    public VisitorAPIResponse build() {
      VisitorAPIResponse response = new VisitorAPIResponse();
      response.setSuccess(success);
      response.setMessage(message);
      response.setData(data);
      return response;
    }
  }
}
