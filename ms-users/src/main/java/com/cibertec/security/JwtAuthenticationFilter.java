package com.cibertec.security;

import com.cibertec.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
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
@Order(2)
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    
    @Autowired
    private JwtService jwtService;
    
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        logger.info("=== JWT Filter ejecutándose para: {} {}", request.getMethod(), request.getRequestURI());
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;
        
        logger.info("Authorization header recibido: {}", authHeader != null ? authHeader.substring(0, Math.min(authHeader.length(), 20)) + "..." : "null");
        
        // Verificar si el header Authorization existe y tiene el formato correcto
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.info("No hay Bearer token válido, continuando sin autenticación JWT");
            filterChain.doFilter(request, response);
            return;
        }
        
        // Extraer el token JWT
        jwt = authHeader.substring(7);
        logger.info("Token JWT extraído exitosamente, longitud: {}", jwt.length());
        
        try {
            // Extraer username del token
            username = jwtService.extractUsername(jwt);
            logger.info("Username extraído del token: {}", username);
            
            // Si el username existe y no hay autenticación previa
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                logger.info("Username válido y no hay autenticación previa, validando token...");
                
                // Validar el token
                if (jwtService.isTokenValid(jwt, username)) {
                    logger.info("Token JWT es válido para usuario: {}", username);
                    
                    // Extraer rol del token
                    String role = jwtService.extractRole(jwt);
                    logger.info("Rol extraído del token: {}", role);
                    
                    // Crear authorities basadas en el rol
                    List<SimpleGrantedAuthority> authorities = List.of(
                            new SimpleGrantedAuthority("ROLE_" + role)
                    );
                    
                    // Crear token de autenticación
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            authorities
                    );
                    
                    // Establecer detalles de la autenticación
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Establecer la autenticación en el contexto de seguridad
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("Autenticación JWT establecida exitosamente para usuario: {} con rol: {}", username, role);
                } else {
                    logger.warn("Token JWT no es válido para usuario: {}", username);
                }
            } else {
                if (username == null) {
                    logger.warn("No se pudo extraer username del token JWT");
                } else {
                    logger.info("Ya existe autenticación previa, saltando autenticación JWT");
                }
            }
        } catch (Exception e) {
            logger.error("Error al procesar JWT: {}", e.getMessage(), e);
        }
        
        // Continuar con la cadena de filtros
        logger.info("Continuando con la cadena de filtros. Autenticación actual: {}", 
                SecurityContextHolder.getContext().getAuthentication() != null ? 
                SecurityContextHolder.getContext().getAuthentication().getName() : "anonymous");
        filterChain.doFilter(request, response);
    }
}