package com.cibertec.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

  @Override
  public void commence(HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException) throws IOException, ServletException {

    log.error("Error de autenticación: {}", authException.getMessage());

    response.setContentType("application/json");
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    Map<String, Object> errorDetails = new HashMap<>();
    errorDetails.put("success", false);
    errorDetails.put("message", "No autorizado: " + authException.getMessage());
    errorDetails.put("data", null);

    ObjectMapper mapper = new ObjectMapper();
    mapper.writeValue(response.getOutputStream(), errorDetails);
  }
}
