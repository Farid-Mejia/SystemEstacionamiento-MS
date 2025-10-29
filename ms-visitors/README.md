# MS-Visitors - Microservicio de Gestión de Visitantes

Microservicio para la gestión de visitantes del sistema de estacionamiento con autenticación JWT.

## Características

- 🔐 Autenticación mediante JWT (token generado por `ms-users`)
- 🔒 Autorización basada en roles (ADMIN, OPERATOR, SECURITY)
- 📝 CRUD completo de visitantes
- 🚀 Registro en Eureka Server
- 🌐 Acceso mediante API Gateway (puerto 8000)

## Tecnologías

- Java 21
- Spring Boot 3.5.7
- Spring Security con JWT
- Spring Cloud (Eureka Client)
- MySQL
- Lombok
- JPA/Hibernate

## Configuración

### Base de Datos

Crea la base de datos en MySQL:

```sql
CREATE DATABASE db_visitors;
```

### Variables de Configuración

Edita `src/main/resources/application.yml` según tu entorno:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/db_visitors
    username: root
    password: tu_password
server:
  port: 9001
jwt:
  secret: ynnZnUmVsXjHBgtOZQuRCiIMeQHPfqXwePYXwiYLIgwsBlvjZe
  expiration: 86400000
```

**Importante:** El secreto JWT debe ser el mismo que en `ms-users`.

## Ejecución

### Prerrequisitos

1. Eureka Server ejecutándose en `http://localhost:8761`
2. API Gateway ejecutándose en `http://localhost:8000`
3. MS-Users ejecutándose en `http://localhost:9000`
4. MySQL ejecutándose en `localhost:3306`

### Iniciar el servicio

```bash
cd ms-visitors
./mvnw spring-boot:run
```

O con Maven instalado:

```bash
mvn spring-boot:run
```

El servicio estará disponible en:

- Directamente: `http://localhost:9001`
- A través del Gateway: `http://localhost:8000/api/visitors`

## API Endpoints

### Autenticación

Todos los endpoints requieren un token JWT válido en el header:

```
Authorization: Bearer <token>
```

Para obtener el token, usa el endpoint de login en `ms-users`:

```bash
POST http://localhost:8000/api/users/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

### Endpoints Disponibles

#### 1. Obtener visitante por DNI

```bash
GET /api/visitors/dni/{dni}
Roles permitidos: ADMIN, OPERATOR, SECURITY
```

Ejemplo:

```bash
curl -X GET "http://localhost:8000/api/visitors/dni/12345678" \
  -H "Authorization: Bearer <tu_token>"
```

#### 2. Obtener todos los visitantes

```bash
GET /api/visitors
Roles permitidos: ADMIN, OPERATOR
```

Ejemplo:

```bash
curl -X GET "http://localhost:8000/api/visitors" \
  -H "Authorization: Bearer <tu_token>"
```

#### 3. Crear visitante

```bash
POST /api/visitors
Roles permitidos: ADMIN, OPERATOR
Content-Type: application/json

{
  "dni": "12345678",
  "firstName": "Juan",
  "paternalLastName": "Pérez",
  "maternalLastName": "García"
}
```

Ejemplo:

```bash
curl -X POST "http://localhost:8000/api/visitors" \
  -H "Authorization: Bearer <tu_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "firstName": "Juan",
    "paternalLastName": "Pérez",
    "maternalLastName": "García"
  }'
```

#### 4. Actualizar visitante

```bash
PUT /api/visitors/{id}
Roles permitidos: ADMIN, OPERATOR
Content-Type: application/json

{
  "dni": "12345678",
  "firstName": "Juan Carlos",
  "paternalLastName": "Pérez",
  "maternalLastName": "García"
}
```

#### 5. Eliminar visitante

```bash
DELETE /api/visitors/{id}
Roles permitidos: ADMIN
```

Ejemplo:

```bash
curl -X DELETE "http://localhost:8000/api/visitors/1" \
  -H "Authorization: Bearer <tu_token>"
```

## Estructura del Proyecto

```
ms-visitors/
├── src/
│   ├── main/
│   │   ├── java/com/cibertec/
│   │   │   ├── application/
│   │   │   │   ├── mapper/          # Mappers de entidades a DTOs
│   │   │   │   └── service/         # Lógica de negocio
│   │   │   ├── domain/
│   │   │   │   ├── model/           # Entidades JPA
│   │   │   │   └── repository/      # Repositorios JPA
│   │   │   ├── security/            # Configuración de seguridad JWT
│   │   │   ├── web/
│   │   │   │   ├── controller/      # Controladores REST
│   │   │   │   └── dto/             # Data Transfer Objects
│   │   │   └── MsVisitorsApplication.java
│   │   └── resources/
│   │       └── application.yml      # Configuración del servicio
│   └── test/
├── pom.xml
└── README.md
```

## Modelo de Datos

### Tabla: visitors

| Campo              | Tipo         | Descripción                   |
| ------------------ | ------------ | ----------------------------- |
| id                 | INT          | ID autogenerado (PK)          |
| dni                | VARCHAR(8)   | DNI del visitante (único)     |
| first_name         | VARCHAR(100) | Nombre del visitante          |
| paternal_last_name | VARCHAR(100) | Apellido paterno              |
| maternal_last_name | VARCHAR(100) | Apellido materno              |
| created_at         | DATETIME     | Fecha de creación (auto)      |
| updated_at         | DATETIME     | Fecha de actualización (auto) |

## Respuestas de la API

Todas las respuestas siguen el siguiente formato:

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {
    "id": 1,
    "dni": "12345678",
    "firstName": "Juan",
    "paternalLastName": "Pérez",
    "maternalLastName": "García",
    "createdAt": "2025-10-28T10:30:00",
    "updatedAt": "2025-10-28T10:30:00"
  }
}
```

## Seguridad

### Validación JWT

El servicio valida:

- ✅ Formato del token
- ✅ Firma del token
- ✅ Expiración del token
- ✅ Usuario y roles en el token

### Roles y Permisos

| Endpoint       | ADMIN | OPERATOR | SECURITY |
| -------------- | ----- | -------- | -------- |
| GET /dni/{dni} | ✅    | ✅       | ✅       |
| GET /          | ✅    | ✅       | ❌       |
| POST /         | ✅    | ✅       | ❌       |
| PUT /{id}      | ✅    | ✅       | ❌       |
| DELETE /{id}   | ✅    | ❌       | ❌       |

## Integración con otros Microservicios

### Flujo de Autenticación

1. Cliente hace login en `ms-users` → recibe token JWT
2. Cliente incluye token en requests a `ms-visitors`
3. `ms-visitors` valida el token usando la misma clave secreta
4. Si es válido, extrae usuario y roles
5. Autoriza la petición según el rol

## Desarrollo

### Ejecutar en modo desarrollo

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Compilar

```bash
./mvnw clean package
```

### Ejecutar tests

```bash
./mvnw test
```

## Troubleshooting

### Error: "Unauthorized"

- Verifica que el token JWT sea válido
- Confirma que el secreto JWT sea el mismo en `ms-users` y `ms-visitors`
- Verifica que el token no haya expirado

### Error: "Access Denied"

- Verifica que tu usuario tenga el rol correcto
- Revisa los logs para ver qué rol se extrajo del token

### Error: "Service Unavailable"

- Verifica que Eureka Server esté ejecutándose
- Confirma que el servicio se registró correctamente en Eureka

## Autor

Desarrollado para el Sistema de Estacionamiento - CIBERTEC

## Licencia

Este proyecto es parte de un proyecto académico.
