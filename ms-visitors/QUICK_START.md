# 🚀 Guía Rápida de Inicio - MS-Visitors

## ✅ ¿Qué se ha creado?

Se ha creado exitosamente el microservicio `ms-visitors` con las siguientes características:

### 📋 Características Principales

- ✅ **Puerto**: 9001
- ✅ **Autenticación JWT**: Utiliza el token generado por `ms-users`
- ✅ **Eureka Client**: Registrado en Eureka Server
- ✅ **API Gateway**: Configurado para acceso por puerto 8000
- ✅ **Base de Datos**: MySQL (db_visitors)
- ✅ **Autorización por Roles**: ADMIN, OPERATOR, SECURITY

### 📁 Estructura Creada

```
ms-visitors/
├── src/
│   ├── main/
│   │   ├── java/com/cibertec/
│   │   │   ├── application/
│   │   │   │   ├── mapper/
│   │   │   │   │   ├── VisitorMapper.java
│   │   │   │   │   └── impl/VisitorMapperImpl.java
│   │   │   │   └── service/
│   │   │   │       ├── VisitorService.java
│   │   │   │       └── impl/VisitorServiceImpl.java
│   │   │   ├── domain/
│   │   │   │   ├── model/Visitor.java
│   │   │   │   └── repository/VisitorRepository.java
│   │   │   ├── security/
│   │   │   │   ├── JwtService.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   ├── JwtAuthenticationEntryPoint.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── web/
│   │   │   │   ├── controller/VisitorController.java
│   │   │   │   └── dto/
│   │   │   │       ├── VisitorRequestDto.java
│   │   │   │       ├── VisitorResponseDto.java
│   │   │   │       └── VisitorAPIResponse.java
│   │   │   └── MsVisitorsApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   └── test/
├── database/
│   └── init.sql
├── pom.xml
├── README.md
├── ARCHITECTURE.md
├── api-tests.http
└── .gitignore
```

## 🔧 Pasos para Iniciar

### 1. Crear la Base de Datos

```sql
CREATE DATABASE db_visitors;
```

O ejecutar el script:
```bash
mysql -u root -p < database/init.sql
```

### 2. Configurar Credenciales de BD

Edita `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    username: tu_usuario
    password: tu_password
```

### 3. Verificar que estén ejecutándose:

- ✅ **Eureka Server** - http://localhost:8761
- ✅ **API Gateway** - http://localhost:8000
- ✅ **MS-Users** - http://localhost:9000
- ✅ **MySQL** - localhost:3306

### 4. Ejecutar el Microservicio

```bash
cd ms-visitors
./mvnw spring-boot:run
```

O con Maven instalado:
```bash
mvn spring-boot:run
```

### 5. Verificar que está funcionando

Abre el navegador:
- Eureka Dashboard: http://localhost:8761
- Deberías ver `MS-VISITORS` registrado

## 🧪 Probar el Servicio

### Paso 1: Obtener Token JWT

```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "tu_password"
  }'
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { ... }
}
```

### Paso 2: Crear un Visitante

```bash
curl -X POST http://localhost:8000/api/visitors \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "firstName": "Juan",
    "paternalLastName": "Pérez",
    "maternalLastName": "García"
  }'
```

### Paso 3: Buscar Visitante por DNI

```bash
curl -X GET http://localhost:8000/api/visitors/dni/12345678 \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Paso 4: Obtener Todos los Visitantes

```bash
curl -X GET http://localhost:8000/api/visitors \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 📊 Endpoints Disponibles

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| GET | `/api/visitors/dni/{dni}` | ADMIN, OPERATOR, SECURITY | Buscar por DNI |
| GET | `/api/visitors` | ADMIN, OPERATOR | Listar todos |
| POST | `/api/visitors` | ADMIN, OPERATOR | Crear visitante |
| PUT | `/api/visitors/{id}` | ADMIN, OPERATOR | Actualizar |
| DELETE | `/api/visitors/{id}` | ADMIN | Eliminar |

## 🔐 Configuración de Seguridad

### JWT Secret (IMPORTANTE)

El `jwt.secret` en `application.yml` **DEBE** ser exactamente el mismo que en `ms-users`:

```yaml
jwt:
  secret: ynnZnUmVsXjHBgtOZQuRCiIMeQHPfqXwePYXwiYLIgwsBlvjZe
  expiration: 86400000
```

### Roles de Usuario

- **ADMIN**: Acceso completo (incluye DELETE)
- **OPERATOR**: Crear, leer y actualizar
- **SECURITY**: Solo lectura

## 🌐 Acceso a través del API Gateway

Todos los endpoints están disponibles a través del API Gateway:

```
http://localhost:8000/api/visitors/*
```

El Gateway se encarga de:
- Enrutamiento a ms-visitors (puerto 9001)
- Balance de carga (si hay múltiples instancias)
- CORS (si está configurado)

## 📝 Archivo de Pruebas HTTP

Se incluye el archivo `api-tests.http` con ejemplos de todas las peticiones. 

**Para usar en VS Code:**
1. Instala la extensión "REST Client"
2. Abre `api-tests.http`
3. Actualiza la variable `@token` con tu token JWT
4. Haz clic en "Send Request" sobre cada petición

## 🔍 Verificar Logs

Para ver los logs detallados:

```bash
tail -f nohup.out
```

O si ejecutaste con `./mvnw spring-boot:run`, verás los logs en la consola.

## ⚠️ Solución de Problemas

### Error: "Unauthorized" (401)

- ✅ Verifica que el token JWT sea válido
- ✅ Confirma que `jwt.secret` sea igual en ms-users y ms-visitors
- ✅ Verifica que el token no haya expirado (24 horas)

### Error: "Forbidden" (403)

- ✅ Verifica que tu usuario tenga el rol correcto
- ✅ Revisa los logs para ver qué rol se extrajo del token

### Error: "Service Unavailable"

- ✅ Verifica que Eureka Server esté ejecutándose
- ✅ Confirma que el servicio se registró en Eureka
- ✅ Revisa que API Gateway esté ejecutándose

### Error de Conexión a BD

- ✅ Verifica que MySQL esté ejecutándose
- ✅ Confirma que existe la base de datos `db_visitors`
- ✅ Verifica usuario y password en `application.yml`

## 📚 Documentación Adicional

- **README.md**: Guía completa del microservicio
- **ARCHITECTURE.md**: Documentación de arquitectura y flujos
- **api-tests.http**: Ejemplos de peticiones HTTP
- **database/init.sql**: Script de inicialización de BD

## 🎉 ¡Listo!

El microservicio `ms-visitors` está completamente configurado y listo para usar. 

### Próximos Pasos Sugeridos:

1. ✅ Crear usuarios de prueba en `ms-users`
2. ✅ Probar todos los endpoints con diferentes roles
3. ✅ Revisar los logs para entender el flujo
4. ✅ Agregar validaciones adicionales si es necesario
5. ✅ Implementar tests unitarios e integración

## 📞 Soporte

Si encuentras algún problema, revisa:
1. Los logs del microservicio
2. El dashboard de Eureka (http://localhost:8761)
3. La documentación en README.md y ARCHITECTURE.md

---

**Desarrollado para**: Sistema de Estacionamiento - CIBERTEC  
**Versión**: 1.0.0  
**Fecha**: Octubre 2025
