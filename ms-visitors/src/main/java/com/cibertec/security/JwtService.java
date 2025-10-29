package com.cibertec.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

  @Value("${jwt.secret}")
  private String secretKey;

  /**
   * Extraer username del token
   */
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  /**
   * Extraer claim específico del token
   */
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  /**
   * Validar si el token es válido para el usuario
   */
  public boolean isTokenValid(String token, String username) {
    final String tokenUsername = extractUsername(token);
    return (tokenUsername.equals(username)) && !isTokenExpired(token);
  }

  /**
   * Verificar si el token ha expirado
   */
  private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  /**
   * Extraer fecha de expiración del token
   */
  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  /**
   * Extraer todos los claims del token
   */
  private Claims extractAllClaims(String token) {
    return Jwts.parser()
        .setSigningKey(getSignInKey())
        .parseClaimsJws(token)
        .getBody();
  }

  /**
   * Obtener la clave de firma
   */
  private SecretKey getSignInKey() {
    byte[] keyBytes = secretKey.getBytes();
    return Keys.hmacShaKeyFor(keyBytes);
  }

  /**
   * Extraer rol del token
   */
  public String extractRole(String token) {
    return extractClaim(token, claims -> claims.get("role", String.class));
  }

  /**
   * Extraer ID del usuario del token
   */
  public Long extractUserId(String token) {
    return extractClaim(token, claims -> claims.get("userId", Long.class));
  }
}
