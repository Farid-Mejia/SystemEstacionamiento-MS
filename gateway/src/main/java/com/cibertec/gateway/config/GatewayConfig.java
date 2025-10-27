package com.cibertec.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración programática adicional del Gateway
 * 
 * Esta clase complementa la configuración YAML con rutas
 * y filtros adicionales definidos programáticamente.
 */
@Configuration
public class GatewayConfig {

    /**
     * Configuración adicional de rutas programáticas
     * Estas rutas complementan las definidas en application.yml
     */
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Ruta para health check del gateway
                .route("gateway-health", r -> r
                        .path("/gateway/health")
                        .uri("forward:/fallback/health"))
                
                // Ruta para documentación de APIs (futuro)
                .route("api-docs", r -> r
                        .path("/api-docs/**")
                        .filters(f -> f
                                .addRequestHeader("X-Gateway", "ParkSystem-Gateway")
                                .addResponseHeader("X-Powered-By", "Spring Cloud Gateway"))
                        .uri("http://localhost:9000"))
                
                .build();
    }
}