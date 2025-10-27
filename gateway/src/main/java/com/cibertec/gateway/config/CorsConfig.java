package com.cibertec.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

/**
 * Configuración de CORS para el API Gateway
 * 
 * Esta configuración permite que el frontend React/Vue pueda comunicarse
 * con los microservicios a través del gateway sin problemas de CORS.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Permitir orígenes específicos (frontend)
        corsConfig.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",    // React default
            "http://localhost:5173",    // Vite default
            "http://localhost:8081",    // Posible frontend alternativo
            "http://127.0.0.1:3000",    // Localhost alternativo
            "http://127.0.0.1:5173",    // Localhost alternativo
            "http://127.0.0.1:8081"     // Localhost alternativo
        ));
        
        // Permitir métodos HTTP
        corsConfig.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // Permitir headers específicos
        corsConfig.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Permitir credenciales (cookies, authorization headers)
        corsConfig.setAllowCredentials(true);
        
        // Tiempo de cache para preflight requests
        corsConfig.setMaxAge(3600L);
        
        // Headers expuestos al cliente
        corsConfig.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "Authorization"
        ));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}