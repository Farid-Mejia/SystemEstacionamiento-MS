package com.cibertec.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
@Order(1)
public class BasicAuthFilter extends OncePerRequestFilter {

    @Value("${app.security.basic.username}")
    private String basicUsername;

    @Value("${app.security.basic.password}")
    private String basicPassword;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        // Solo aplicar Basic Auth a endpoints específicos
        if (requestPath.equals("/api/users/login") || requestPath.equals("/api/users/validate")) {

            String authHeader = request.getHeader("Authorization");

            // Si el request tiene Bearer token, permitir que pase al filtro JWT
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            // Para requests sin Bearer token, requerir Basic Auth
            if (authHeader == null || !authHeader.startsWith("Basic ")) {
                sendUnauthorizedResponse(response, "Se requiere autenticación básica");
                return;
            }

            try {
                // Extraer credenciales del header Basic Auth
                String base64Credentials = authHeader.substring("Basic ".length());
                byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
                String credentials = new String(credDecoded, StandardCharsets.UTF_8);

                String[] values = credentials.split(":", 2);
                if (values.length != 2) {
                    sendUnauthorizedResponse(response, "Formato de credenciales inválido");
                    return;
                }

                String username = values[0];
                String password = values[1];

                // Validar credenciales
                if (!basicUsername.equals(username) || !basicPassword.equals(password)) {
                    sendUnauthorizedResponse(response, "Credenciales básicas inválidas");
                    return;
                }

            } catch (Exception e) {
                sendUnauthorizedResponse(response, "Error al procesar credenciales básicas");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setHeader("WWW-Authenticate", "Basic realm=\"ParkSystem API\"");

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        errorResponse.put("error", "Unauthorized");
        errorResponse.put("status", HttpServletResponse.SC_UNAUTHORIZED);

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
}