package com.cibertec.config;

import com.cibertec.entity.Role;
import com.cibertec.entity.User;
import com.cibertec.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Verificar si ya existen usuarios
        if (userRepository.count() == 0) {
            // Crear usuario ADMIN
            User admin = new User();
            admin.setDni("12345678");
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setFirstName("Juan Carlos");
            admin.setPaternalLastName("Pérez");
            admin.setMaternalLastName("García");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            
            // Crear usuario OPERATOR
            User operator = new User();
            operator.setDni("87654321");
            operator.setUsername("operator");
            operator.setPassword(passwordEncoder.encode("123456"));
            operator.setFirstName("María Elena");
            operator.setPaternalLastName("López");
            operator.setMaternalLastName("Martínez");
            operator.setRole(Role.OPERATOR);
            userRepository.save(operator);
            
            System.out.println("Usuarios de prueba creados:");
            System.out.println("- admin / 123456 (ADMIN)");
            System.out.println("- operator / 123456 (OPERATOR)");
        }
    }
}