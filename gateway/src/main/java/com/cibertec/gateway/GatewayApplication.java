package com.cibertec.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Aplicación principal del API Gateway para el sistema ParkSystem
 * 
 * Este gateway actúa como punto de entrada único para todos los microservicios
 * del sistema de estacionamiento, proporcionando:
 * - Enrutamiento de requests
 * - Balanceador de carga
 * - Circuit breaker
 * - CORS configuration
 * - Logging y monitoreo
 */
@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

}