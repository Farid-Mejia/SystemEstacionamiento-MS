# Arquitectura y Seguridad - MS-Visitors

## Descripción General

`ms-visitors` es un microservicio RESTful que forma parte del Sistema de Estacionamiento desarrollado para CIBERTEC. Su función principal es gestionar la información de los visitantes (profesores, alumnos y cualquier integrante de CIBERTEC) que utilizan el estacionamiento.

## Arquitectura del Microservicio

### Patrón de Diseño: Arquitectura en Capas (Layered Architecture)

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Controllers / REST Endpoints)       │
│    - VisitorController                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│    (Services / Business Logic)          │
│    - VisitorService                     │
│    - VisitorMapper                      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           Domain Layer                  │
│    (Entities / Repository)              │
│    - Visitor (Entity)                   │
│    - VisitorRepository                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Infrastructure Layer              │
│    (Database / External Services)       │
│    - MySQL Database                     │
│    - Eureka Client                      │
└─────────────────────────────────────────┘
```

### Componentes de Seguridad

```
┌─────────────────────────────────────────┐
│         Security Layer                  │
│    - JwtAuthenticationFilter            │
│    - JwtService                         │
│    - SecurityConfig                     │
│    - JwtAuthenticationEntryPoint        │
└─────────────────────────────────────────┘
```

## Flujo de Autenticación JWT

### 1. Obtención del Token (en ms-users)

```
┌──────────┐         Login Request          ┌──────────┐
│  Client  │ ─────────────────────────────→  │ ms-users │
│          │    {username, password}         │          │
└──────────┘                                 └──────────┘
                                                    │
                                                    ↓
                                            ┌──────────────┐
                                            │  Validate    │
                                            │  Credentials │
                                            └──────────────┘
                                                    │
                                                    ↓
                                            ┌──────────────┐
                                            │  Generate    │
                                            │  JWT Token   │
                                            └──────────────┘
                                                    │
┌──────────┐         JWT Token              ┌──────────┐
│  Client  │ ←─────────────────────────────  │ ms-users │
│          │    {token, user info}           │          │
└──────────┘                                 └──────────┘
```

### 2. Uso del Token en ms-visitors

```
┌──────────┐     Request + JWT Token        ┌─────────────┐
│  Client  │ ─────────────────────────────→  │ API Gateway │
│          │  Authorization: Bearer <token>  │  :8000      │
└──────────┘                                 └─────────────┘
                                                    │
                                                    ↓
                                            ┌─────────────┐
                                            │ Route to    │
                                            │ ms-visitors │
                                            └─────────────┘
                                                    │
                                                    ↓
                                            ┌─────────────┐
                                            │ms-visitors  │
                                            │    :9001    │
                                            └─────────────┘
                                                    │
                                                    ↓
                                    ┌───────────────────────────┐
                                    │ JwtAuthenticationFilter   │
                                    │                           │
                                    │ 1. Extract token          │
                                    │ 2. Validate signature     │
                                    │ 3. Check expiration       │
                                    │ 4. Extract user & role    │
                                    └───────────────────────────┘
                                                    │
                                    ┌───────────────┴────────────────┐
                                    │                                │
                            Token Valid?                      Token Invalid
                                    │                                │
                                    ↓                                ↓
                        ┌─────────────────────┐          ┌──────────────────┐
                        │ SecurityContext     │          │ Return 401       │
                        │ Set Authentication  │          │ Unauthorized     │
                        └─────────────────────┘          └──────────────────┘
                                    │
                                    ↓
                        ┌─────────────────────┐
                        │ Authorization Check │
                        │ (Role-based)        │
                        └─────────────────────┘
                                    │
                        ┌───────────┴────────────┐
                        │                        │
                Has Required Role?         No Permission
                        │                        │
                        ↓                        ↓
            ┌─────────────────────┐    ┌──────────────────┐
            │ Process Request     │    │ Return 403       │
            │ Execute Business    │    │ Forbidden        │
            │ Logic               │    └──────────────────┘
            └─────────────────────┘
                        │
                        ↓
            ┌─────────────────────┐
            │ Return Response     │
            └─────────────────────┘
```

## Detalles de Seguridad

### Componentes de Seguridad

#### 1. JwtService
- **Responsabilidad**: Manejo y validación de tokens JWT
- **Métodos principales**:
  - `extractUsername(token)`: Extrae el usuario del token
  - `extractRole(token)`: Extrae el rol del usuario
  - `isTokenValid(token, username)`: Valida el token
  - `extractClaim(token, resolver)`: Extrae claims específicos

#### 2. JwtAuthenticationFilter
- **Responsabilidad**: Interceptar todas las peticiones HTTP y validar el token JWT
- **Orden de ejecución**: Se ejecuta antes de `UsernamePasswordAuthenticationFilter`
- **Proceso**:
  1. Extrae el header `Authorization`
  2. Valida el formato `Bearer <token>`
  3. Extrae y valida el token
  4. Crea el contexto de seguridad con usuario y roles
  5. Permite o rechaza la petición

#### 3. SecurityConfig
- **Responsabilidad**: Configuración global de seguridad
- **Configuraciones**:
  - CSRF: Deshabilitado (API REST stateless)
  - CORS: Deshabilitado (manejado por API Gateway)
  - Session Management: STATELESS
  - Authorization: Basada en roles

#### 4. JwtAuthenticationEntryPoint
- **Responsabilidad**: Manejo de errores de autenticación
- **Comportamiento**: Retorna respuesta JSON con código 401

### Configuración de Autorización por Endpoint

| Endpoint | Método | Roles Permitidos | Descripción |
|----------|--------|------------------|-------------|
| `/api/visitors/dni/{dni}` | GET | ADMIN, OPERATOR, SECURITY | Buscar visitante por DNI |
| `/api/visitors` | GET | ADMIN, OPERATOR | Listar todos los visitantes |
| `/api/visitors` | POST | ADMIN, OPERATOR | Crear nuevo visitante |
| `/api/visitors/{id}` | PUT | ADMIN, OPERATOR | Actualizar visitante |
| `/api/visitors/{id}` | DELETE | ADMIN | Eliminar visitante |

## Integración con Microservicios

### Eureka Service Discovery

```
┌─────────────────┐
│ Eureka Server   │
│    :8761        │
└─────────────────┘
         ↑
         │ Register & Heartbeat
         │
    ┌────┴─────┬──────────┬──────────────┐
    ↓          ↓          ↓              ↓
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ms-users │ │ms-visit-│ │api-gate-│ │  otros  │
│  :9000  │ │ors:9001 │ │way:8000 │ │   MS    │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Comunicación entre Microservicios

```
┌──────────┐         ┌─────────────┐         ┌─────────────┐
│  Client  │────────→│ API Gateway │────────→│ ms-visitors │
└──────────┘         │  :8000      │         │   :9001     │
                     └─────────────┘         └─────────────┘
                            │
                            ↓
                     ┌─────────────┐
                     │   Eureka    │
                     │   Server    │
                     │   :8761     │
                     └─────────────┘
```

## Modelo de Datos

### Entidad Visitor

```java
@Entity
@Table(name = "visitors")
public class Visitor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 8, unique = true)
    private String dni;
    
    @Column(nullable = false, length = 100)
    private String firstName;
    
    @Column(nullable = false, length = 100)
    private String paternalLastName;
    
    @Column(nullable = false, length = 100)
    private String maternalLastName;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### Diagrama ER

```
┌─────────────────────────────────┐
│          VISITORS               │
├─────────────────────────────────┤
│ PK │ id (INT)                   │
│    │ dni (VARCHAR 8) UNIQUE     │
│    │ first_name (VARCHAR 100)   │
│    │ paternal_last_name (100)   │
│    │ maternal_last_name (100)   │
│    │ created_at (DATETIME)      │
│    │ updated_at (DATETIME)      │
└─────────────────────────────────┘
```

## Configuración Compartida entre Microservicios

### JWT Configuration (debe ser idéntica en ms-users y ms-visitors)

```yaml
jwt:
  secret: ynnZnUmVsXjHBgtOZQuRCiIMeQHPfqXwePYXwiYLIgwsBlvjZe
  expiration: 86400000  # 24 horas en milisegundos
```

⚠️ **Importante**: El `jwt.secret` DEBE ser exactamente el mismo en todos los microservicios que validen tokens JWT.

## Escalabilidad y Alta Disponibilidad

### Escalado Horizontal

```
                    ┌─────────────┐
                    │ API Gateway │
                    └─────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ ms-visitors  │  │ ms-visitors  │  │ ms-visitors  │
│  Instance 1  │  │  Instance 2  │  │  Instance 3  │
│    :9001     │  │    :9002     │  │    :9003     │
└──────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ↓
                    ┌─────────────┐
                    │   MySQL DB  │
                    └─────────────┘
```

## Mejores Prácticas Implementadas

1. **Stateless**: No se mantiene estado en el servidor
2. **Token-based Authentication**: JWT para autenticación
3. **Role-based Authorization**: Control de acceso basado en roles
4. **Layered Architecture**: Separación clara de responsabilidades
5. **DTOs**: Separación entre modelos de dominio y transferencia de datos
6. **Logging**: Logging detallado para debugging y auditoría
7. **Exception Handling**: Manejo centralizado de excepciones
8. **Service Discovery**: Integración con Eureka para descubrimiento de servicios

## Seguridad Adicional Recomendada

### Para Producción

1. **HTTPS**: Usar certificados SSL/TLS
2. **Rate Limiting**: Limitar número de peticiones por cliente
3. **API Key**: Adicional al JWT para identificar clientes
4. **Auditoría**: Registrar todas las operaciones críticas
5. **Encriptación de BD**: Encriptar datos sensibles en base de datos
6. **Secrets Management**: Usar servicios como HashiCorp Vault
7. **CORS**: Configurar correctamente los orígenes permitidos

## Monitoreo y Observabilidad

### Métricas Recomendadas

1. **Tasa de peticiones**: Requests por segundo
2. **Tasa de errores**: 4xx y 5xx responses
3. **Latencia**: Tiempo de respuesta
4. **Autenticaciones fallidas**: Intentos de acceso no autorizados
5. **Uso de recursos**: CPU, memoria, conexiones BD

### Herramientas Sugeridas

- **Spring Boot Actuator**: Métricas y health checks
- **Prometheus**: Recolección de métricas
- **Grafana**: Visualización de métricas
- **ELK Stack**: Centralización de logs
- **Zipkin/Jaeger**: Trazabilidad distribuida

## Conclusión

`ms-visitors` es un microservicio robusto y seguro que implementa las mejores prácticas de desarrollo de microservicios, con un enfoque especial en la seguridad mediante JWT y autorización basada en roles. Su diseño permite escalabilidad horizontal y fácil integración con otros microservicios del sistema.
