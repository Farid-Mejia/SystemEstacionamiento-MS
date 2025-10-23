package com.cibertec.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.InputStream;
import java.security.KeyStore;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Configuration
@EnableConfigurationProperties(JwkProperties.class)
public class JwkConfiguration {
  private final JwkProperties jwkProperties;
  private final ResourceLoader resourceLoader;

  public JwkConfiguration(JwkProperties jwkProperties, ResourceLoader resourceLoader) {
    this.jwkProperties = jwkProperties;
    this.resourceLoader = resourceLoader;
  }

  @Bean
  JWKSource jwkSource() throws Exception {
    Resource resource = resourceLoader.getResource(jwkProperties.keystorePath());
    KeyStore keyStore = KeyStore.getInstance("PKCS12");
    try (InputStream inputStream = resource.getInputStream()) {
      keyStore.load(inputStream, jwkProperties.keyPassword().toCharArray());
    }
    RSAPrivateKey rsaPrivateKey = (RSAPrivateKey) keyStore.getKey(
        jwkProperties.keyAlias(), jwkProperties.keyPassword().toCharArray());

    RSAPublicKey rsaPublicKey = (RSAPublicKey) keyStore
        .getCertificate(jwkProperties.keyAlias())
        .getPublicKey();

    RSAKey rsaKey = new RSAKey.Builder(rsaPublicKey)
        .privateKey(rsaPrivateKey)
        .keyID(jwkProperties.keyAlias())
        .build();

    return new ImmutableJWKSet(new JWKSet(rsaKey));
  }
}
