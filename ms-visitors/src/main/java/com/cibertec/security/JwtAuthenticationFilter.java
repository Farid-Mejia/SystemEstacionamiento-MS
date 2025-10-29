package com.cibertec.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;

  public JwtAuthenticationFilter(JwtService jwtService) {
    this.jwtService = jwtService;
  }

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain) throws ServletException, IOException {

    System.out.println("=== JWT Filter ejecutándose para: " + request.getMethod() + " " + request.getRequestURI());

    final String authHeader = request.getHeader("Authorization");
    final String jwt;
    final String username;

    // Verificar si el header Authorization existe y tiene el formato correcto
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      System.out.println("No hay Bearer token válido, continuando sin autenticación JWT");
      filterChain.doFilter(request, response);
      return;
    }

    // Extraer el token JWT
    jwt = authHeader.substring(7);
    System.out.println("Token JWT extraído exitosamente");

    try {
      // Extraer username del token
      username = jwtService.extractUsername(jwt);
      System.out.println("Username extraído del token: " + username);

      // Si el username existe y no hay autenticación previa
      if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        System.out.println("Username válido y no hay autenticación previa, validando token...");

        // Validar el token
        if (jwtService.isTokenValid(jwt, username)) {
          System.out.println("Token JWT es válido para usuario: " + username);

          // Extraer rol del token
          String role = jwtService.extractRole(jwt);
          System.out.println("Rol extraído del token: " + role);

          // Crear authorities basadas en el rol
          List<SimpleGrantedAuthority> authorities = List.of(
              new SimpleGrantedAuthority("ROLE_" + role));

          // Crear token de autenticación
          UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
              username,
              null,
              authorities);

          // Establecer detalles de la autenticación
          authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

          // Establecer la autenticación en el contexto de seguridad
          SecurityContextHolder.getContext().setAuthentication(authToken);
          System.out.println("Autenticación JWT establecida exitosamente para usuario: " + username + " con rol: " + role);
        } else {
          System.out.println("Token JWT no es válido para usuario: " + username);
        }
      }
    } catch (Exception e) {
      System.out.println("Error procesando token JWT: " + e.getMessage());
    }

    filterChain.doFilter(request, response);
  }
}
