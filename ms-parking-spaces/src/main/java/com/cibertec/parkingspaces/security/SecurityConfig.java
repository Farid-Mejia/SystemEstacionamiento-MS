package com.cibertec.parkingspaces.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Autowired
        private JwtAuthenticationFilter jwtAuthenticationFilter;

        @Autowired
        private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                // Deshabilitar CSRF ya que usamos JWT
                                .csrf(AbstractHttpConfigurer::disable)

                                // Deshabilitar CORS ya que el Gateway maneja CORS
                                .cors(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests(authz -> authz
                                                .requestMatchers("/api/parking-spaces/health").permitAll()
                                .requestMatchers("/api/parking-spaces/*/status").permitAll() // Temporal para inter-microservice calls
                                .requestMatchers("/api/parking-spaces/init-test-data").permitAll() // Temporal para crear datos de prueba
                                .requestMatchers("/api/parking-spaces/list-all").permitAll() // Temporal para listar parking spaces
                                                .requestMatchers("/api/parking-spaces/**").authenticated()
                                                .anyRequest().authenticated())
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint(jwtAuthenticationEntryPoint))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}