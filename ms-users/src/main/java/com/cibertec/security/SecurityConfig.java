package com.cibertec.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

        @Autowired
        private JwtAuthenticationFilter jwtAuthenticationFilter;

        @Autowired
        private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

        @Autowired
        private BasicAuthFilter basicAuthFilter;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                // Deshabilitar CSRF ya que usamos JWT
                                .csrf(AbstractHttpConfigurer::disable)

                                // Deshabilitar CORS ya que el Gateway maneja CORS
                                .cors(AbstractHttpConfigurer::disable)

                                // Configurar autorización de requests
                                .authorizeHttpRequests(authz -> authz
                                                .requestMatchers("/api/users/login").permitAll()
                                                .requestMatchers("/api/users/validate").permitAll()
                                                .requestMatchers("/api/users").hasAnyRole("ADMIN", "OPERATOR")
                                                .anyRequest().authenticated())

                                // Configurar manejo de excepciones
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint(jwtAuthenticationEntryPoint))

                                // Configurar gestión de sesiones como STATELESS
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                // Agregar filtro de autenticación básica antes del filtro de autenticación por
                                // username/password
                                .addFilterBefore(basicAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                // Agregar filtro JWT después del filtro de autenticación básica
                                .addFilterAfter(jwtAuthenticationFilter, BasicAuthFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

}