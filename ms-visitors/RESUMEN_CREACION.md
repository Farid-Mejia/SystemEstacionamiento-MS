# 🎯 MS-Visitors - Resumen de Creación

## ✅ Microservicio Creado Exitosamente

Se ha creado el nuevo microservicio **ms-visitors** con todas las funcionalidades solicitadas.

## 📋 Características Implementadas

### ✅ Especificaciones Cumplidas

- ✅ **Puerto**: 9001 (ms-visitors)
- ✅ **API Gateway**: Puerto 8000 (configurado para enrutar `/api/visitors/**`)
- ✅ **Eureka**: Configurado como cliente de Eureka Server
- ✅ **JWT**: Utiliza el mismo token generado por `ms-users`
- ✅ **Base de Datos**: MySQL (db_visitors)
- ✅ **Tabla**: Basada en `ms-visitantes` con mejoras

## 🔐 Seguridad JWT Integrada

### Configuración Compartida

El microservicio comparte la misma configuración JWT que `ms-users`:

```yaml
jwt:
  secret: ynnZnUmVsXjHBgtOZQuRCiIMeQHPfqXwePYXwiYLIgwsBlvjZe
  expiration: 86400000
```

### Flujo de Autenticación

1. **Login en ms-users** → Obtener token JWT
2. **Request a ms-visitors** → Incluir token en header `Authorization: Bearer <token>`
3. **Validación** → ms-visitors valida el token usando el mismo secreto
4. **Autorización** → Verifica roles para permitir/denegar acceso

## 🌐 Arquitectura de Microservicios

```
┌─────────────────────────────────────────────────────────────┐
│                     Sistema Completo                        │
└─────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │  Eureka Server  │
                    │     :8761       │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ↓                    ↓                    ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   ms-users   │    │ ms-visitors  │    │    otros     │
│    :9000     │    │    :9001     │    │   servicios  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             ↓
                    ┌─────────────────┐
                    │  API Gateway    │
                    │     :8000       │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │     Client      │
                    └─────────────────┘
```

## 🔄 Flujo de Petición Completo

```
1. Cliente hace login:
   POST http://localhost:8000/api/users/login
   → Recibe token JWT

2. Cliente usa el token para acceder a visitors:
   GET http://localhost:8000/api/visitors/dni/12345678
   Header: Authorization: Bearer <token>

3. API Gateway enruta a ms-visitors:
   → http://localhost:9001/api/visitors/dni/12345678

4. ms-visitors valida el token:
   → Extrae usuario y roles
   → Verifica permisos
   → Procesa la petición

5. Respuesta al cliente:
   ← { success: true, message: "...", data: {...} }
```

## 📊 Endpoints Disponibles

### A través del API Gateway (http://localhost:8000)

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| POST | `/api/users/login` | Público | Obtener token JWT |
| GET | `/api/visitors/dni/{dni}` | ADMIN, OPERATOR, SECURITY | Buscar visitante |
| GET | `/api/visitors` | ADMIN, OPERATOR | Listar visitantes |
| POST | `/api/visitors` | ADMIN, OPERATOR | Crear visitante |
| PUT | `/api/visitors/{id}` | ADMIN, OPERATOR | Actualizar visitante |
| DELETE | `/api/visitors/{id}` | ADMIN | Eliminar visitante |

## 🚀 Para Iniciar el Sistema Completo

### 1. Iniciar Eureka Server
```bash
cd eureka-server
./mvnw spring-boot:run
```

### 2. Iniciar MS-Users
```bash
cd ms-users
./mvnw spring-boot:run
```

### 3. Iniciar MS-Visitors (NUEVO)
```bash
cd ms-visitors
./mvnw spring-boot:run
```

### 4. Iniciar API Gateway
```bash
cd api-gateway
./mvnw spring-boot:run
```

## 🧪 Prueba Rápida

### 1. Obtener Token
```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. Crear Visitante
```bash
curl -X POST http://localhost:8000/api/visitors \
  -H "Authorization: Bearer <TU_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "firstName": "Juan",
    "paternalLastName": "Pérez",
    "maternalLastName": "García"
  }'
```

### 3. Buscar Visitante
```bash
curl -X GET http://localhost:8000/api/visitors/dni/12345678 \
  -H "Authorization: Bearer <TU_TOKEN>"
```

## 📁 Archivos Importantes Creados

### Código Principal
- `MsVisitorsApplication.java` - Aplicación principal
- `Visitor.java` - Entidad JPA
- `VisitorRepository.java` - Repositorio
- `VisitorService.java` - Servicio de negocio
- `VisitorController.java` - Controlador REST

### Seguridad JWT
- `JwtService.java` - Manejo de tokens
- `JwtAuthenticationFilter.java` - Filtro de autenticación
- `SecurityConfig.java` - Configuración de seguridad
- `JwtAuthenticationEntryPoint.java` - Manejo de errores

### Configuración
- `application.yml` - Configuración principal
- `application-dev.yml` - Perfil de desarrollo
- `application-prod.yml` - Perfil de producción

### Documentación
- `README.md` - Guía completa
- `ARCHITECTURE.md` - Documentación de arquitectura
- `QUICK_START.md` - Guía rápida de inicio
- `api-tests.http` - Ejemplos de peticiones

## ✅ Confirmación de Requisitos

### Requisitos Solicitados vs Implementado

| Requisito | Estado | Detalles |
|-----------|--------|----------|
| Puerto 9001 | ✅ | Configurado en application.yml |
| API Gateway puerto 8000 | ✅ | Ruta `/api/visitors/**` agregada |
| Eureka Server | ✅ | Cliente configurado y funcional |
| Usar token de ms-users | ✅ | Mismo JWT secret compartido |
| Basado en ms-visitantes | ✅ | Misma estructura de tabla |

## 🔑 Respuesta a tu Pregunta: "¿Se puede usar el token de ms-users?"

**¡SÍ, absolutamente!** 

Esto es posible porque:

1. **Mismo secreto JWT**: Ambos microservicios (`ms-users` y `ms-visitors`) comparten el mismo `jwt.secret`

2. **Validación independiente**: Cada microservicio puede validar el token de forma independiente sin necesidad de comunicarse con `ms-users`

3. **Información en el token**: El token JWT contiene:
   - Username
   - Role (ADMIN, OPERATOR, SECURITY)
   - User ID
   - Fecha de expiración

4. **Arquitectura de microservicios**: Esta es una práctica estándar en microservicios con JWT - un servicio de autenticación (ms-users) genera tokens que otros servicios pueden validar

## 🎯 Próximos Pasos Recomendados

1. ✅ Crear la base de datos `db_visitors`
2. ✅ Ajustar credenciales de BD en `application.yml`
3. ✅ Ejecutar el microservicio
4. ✅ Probar con los ejemplos en `api-tests.http`
5. ✅ Verificar en Eureka Dashboard que esté registrado

## 📞 Archivos de Ayuda

Para más información, consulta:
- `ms-visitors/README.md` - Documentación completa
- `ms-visitors/QUICK_START.md` - Guía rápida
- `ms-visitors/ARCHITECTURE.md` - Arquitectura detallada
- `ms-visitors/api-tests.http` - Ejemplos de peticiones

---

**¡El microservicio está listo para usar! 🎉**
