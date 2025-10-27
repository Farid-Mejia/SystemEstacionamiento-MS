package com.cibertec.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Filtro global para logging de requests y responses
 * 
 * Este filtro registra información importante sobre cada request
 * que pasa por el gateway, incluyendo:
 * - Método HTTP y URI
 * - Headers importantes
 * - Tiempo de procesamiento
 * - Código de respuesta
 */
@Component
public class LoggingFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        long startTime = System.currentTimeMillis();
        
        // Log del request entrante
        logRequest(request);
        
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            ServerHttpResponse response = exchange.getResponse();
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            // Log del response
            logResponse(request, response, duration);
        }));
    }

    private void logRequest(ServerHttpRequest request) {
        String timestamp = LocalDateTime.now().format(formatter);
        String method = request.getMethod().toString();
        String uri = request.getURI().toString();
        String remoteAddress = getClientIp(request);
        
        logger.info("🔵 [{}] INCOMING REQUEST: {} {} from {} | Headers: {}", 
                   timestamp, method, uri, remoteAddress, 
                   getImportantHeaders(request));
    }

    private void logResponse(ServerHttpRequest request, ServerHttpResponse response, long duration) {
        String timestamp = LocalDateTime.now().format(formatter);
        String method = request.getMethod().toString();
        String uri = request.getPath().toString();
        int statusCode = response.getStatusCode() != null ? response.getStatusCode().value() : 0;
        
        String logLevel = statusCode >= 400 ? "🔴" : statusCode >= 300 ? "🟡" : "🟢";
        
        logger.info("{} [{}] RESPONSE: {} {} | Status: {} | Duration: {}ms", 
                   logLevel, timestamp, method, uri, statusCode, duration);
    }

    private String getClientIp(ServerHttpRequest request) {
        String xForwardedFor = request.getHeaders().getFirst("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeaders().getFirst("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddress() != null ? 
               request.getRemoteAddress().getAddress().getHostAddress() : "unknown";
    }

    private String getImportantHeaders(ServerHttpRequest request) {
        StringBuilder headers = new StringBuilder();
        
        // Headers importantes para debugging
        String[] importantHeaders = {"Authorization", "Content-Type", "User-Agent", "Origin"};
        
        for (String headerName : importantHeaders) {
            String headerValue = request.getHeaders().getFirst(headerName);
            if (headerValue != null) {
                if (headers.length() > 0) headers.append(", ");
                
                // Ocultar token completo por seguridad
                if ("Authorization".equals(headerName) && headerValue.startsWith("Bearer ")) {
                    headers.append(headerName).append("=Bearer ***");
                } else {
                    headers.append(headerName).append("=").append(headerValue);
                }
            }
        }
        
        return headers.toString();
    }

    @Override
    public int getOrder() {
        return -1; // Ejecutar antes que otros filtros
    }
}