# ParkSystem API Gateway

API Gateway para el sistema de estacionamiento ParkSystem, construido con Spring Cloud Gateway.

## 🚀 Características

- **Enrutamiento inteligente**: Dirige las peticiones a los microservicios correspondientes
- **Circuit Breaker**: Protección contra fallos en cascada con Resilience4j
- **CORS configurado**: Permite comunicación desde frontend React/Vue
- **Rate Limiting**: Control de tasa de peticiones
- **Logging detallado**: Monitoreo completo de requests y responses
- **Fallback responses**: Respuestas de emergencia cuando los servicios no están disponibles
- **Health checks**: Monitoreo del estado del gateway y servicios

## 🏗️ Arquitectura

```
Frontend (React/Vue) → Gateway (8080) → Microservicios
                                      ├── ms-autentication (9000)
                                      └── ms-users (9001)
```

## 📋 Rutas Configuradas

### Autenticación
- `POST /api/auth/login` → ms-autentication:9000
- `POST /api/auth/validate` → ms-autentication:9000
- `GET /api/auth/me` → ms-autentication:9000

### Usuarios (preparado para futuro)
- `GET /api/users/**` → ms-users:9001
- `POST /api/users/**` → ms-users:9001
- `PUT /api/users/**` → ms-users:9001
- `DELETE /api/users/**` → ms-users:9001

### Gateway Management
- `GET /gateway/health` → Health check del gateway
- `GET /actuator/**` → Endpoints de monitoreo

## 🔧 Configuración

### Puertos
- **Gateway**: 8080
- **ms-autentication**: 9000
- **ms-users**: 9001

### CORS
Configurado para permitir requests desde:
- `http://localhost:3000` (React)
- `http://localhost:5173` (Vite)
- `http://localhost:8081`

### Circuit Breaker
- **Sliding Window**: 10 requests
- **Failure Rate Threshold**: 50%
- **Wait Duration**: 5 segundos
- **Half Open Calls**: 3

## 🚀 Ejecución

### Prerrequisitos
- Java 21
- Maven 3.6+
- ms-autentication ejecutándose en puerto 9000

### Comandos

```bash
# Compilar el proyecto
./mvnw clean compile

# Ejecutar el gateway
./mvnw spring-boot:run

# Ejecutar en background
nohup ./mvnw spring-boot:run > gateway.log 2>&1 &
```

### Verificar funcionamiento

```bash
# Health check del gateway
curl http://localhost:8080/gateway/health

# Test de enrutamiento a autenticación
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic cGFya3N5c3RlbV9hcGk6UGFya1N5c3RlbTIwMjQhU2VjdXJlQVBJ" \
  -d '{"username":"admin","password":"admin123"}'

# Verificar actuator endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/gateway/routes
```

## 📊 Monitoreo

### Actuator Endpoints
- `/actuator/health` - Estado del gateway
- `/actuator/gateway/routes` - Rutas configuradas
- `/actuator/circuitbreakers` - Estado de circuit breakers
- `/actuator/metrics` - Métricas del sistema

### Logs
Los logs incluyen información detallada sobre:
- Requests entrantes con headers importantes
- Tiempo de respuesta de cada request
- Estado de circuit breakers
- Errores y excepciones

## 🔒 Seguridad

### CORS
- Configurado para permitir credenciales
- Headers específicos permitidos
- Métodos HTTP restringidos

### Rate Limiting
- 10 requests por segundo por IP
- Burst capacity de 20 requests

## 🛠️ Desarrollo

### Estructura del proyecto
```
gateway/
├── src/main/java/com/cibertec/gateway/
│   ├── GatewayApplication.java          # Clase principal
│   ├── config/
│   │   ├── CorsConfig.java              # Configuración CORS
│   │   └── GatewayConfig.java           # Configuración adicional
│   ├── controller/
│   │   └── FallbackController.java      # Controlador de fallbacks
│   └── filter/
│       └── LoggingFilter.java           # Filtro de logging
├── src/main/resources/
│   └── application.yml                  # Configuración principal
└── pom.xml                             # Dependencias Maven
```

### Agregar nuevos microservicios

1. Agregar ruta en `application.yml`:
```yaml
- id: nuevo-servicio
  uri: http://localhost:PUERTO
  predicates:
    - Path=/api/nuevo/**
  filters:
    - name: CircuitBreaker
      args:
        name: nuevo-servicio-cb
        fallbackUri: forward:/fallback/nuevo
```

2. Agregar fallback en `FallbackController.java`
3. Configurar circuit breaker en `application.yml`

## 🐛 Troubleshooting

### Gateway no inicia
- Verificar que el puerto 8080 esté libre
- Revisar logs de Spring Boot
- Verificar dependencias en `pom.xml`

### Requests no llegan a microservicios
- Verificar que los microservicios estén ejecutándose
- Revisar configuración de rutas en `application.yml`
- Verificar logs del gateway para errores de enrutamiento

### Problemas de CORS
- Verificar configuración en `CorsConfig.java`
- Revisar que el origen del frontend esté permitido
- Verificar headers en las peticiones

### Circuit Breaker activado
- Revisar estado del microservicio de destino
- Verificar métricas en `/actuator/circuitbreakers`
- Esperar a que el circuit breaker se recupere automáticamente

## 📝 Notas

- El gateway está configurado para funcionar sin Eureka por defecto
- Los timeouts están configurados para 30 segundos
- El rate limiting requiere Redis para funcionar completamente
- Los logs están configurados en nivel DEBUG para desarrollo