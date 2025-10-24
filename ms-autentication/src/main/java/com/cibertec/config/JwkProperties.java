package com.cibertec.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwk")
public record JwkProperties(
    String keystorePath,
    String keystorePassword,
    String keyAlias,
    String keyPassword) {
}
