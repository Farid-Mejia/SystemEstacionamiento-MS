# 🚗 ParkSystem API - Documentación

## Descripción
API REST para el sistema de gestión de estacionamiento de CIBERTEC. Permite gestionar usuarios, vehículos, espacios de estacionamiento y sesiones de parking.

## 🚀 Cómo ejecutar la API

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm

### Instalación y ejecución
```bash
# Instalar dependencias
npm install

# Ejecutar la API
npm start
```

La API se ejecutará en: **http://localhost:3000**

## 🔐 Autenticación

La API utiliza un sistema de autenticación con JWT que incluye:

- **Access Token**: Token de corta duración (15 minutos) para acceder a endpoints protegidos
- **Refresh Token**: Token de larga duración (7 días) para renovar access tokens

### Flujo de autenticación:

1. **Login**: Obtén access_token y refresh_token con credenciales válidas
2. **Acceso**: Usa el access_token en el header `Authorization: Bearer <access_token>`
3. **Renovación**: Cuando el access_token expire, usa el refresh_token para obtener uno nuevo
4. **Logout**: Cierra sesión (en implementación real invalidaría los tokens)

## 📊 Datos de Prueba

### Credenciales de Operadores
| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | 123456 | admin |
| operador01 | 123456 | operator |
| operador02 | 123456 | operator |

### DNIs de Usuarios de Prueba
| DNI | Nombre | Email |
|-----|--------|-------|
| 12345678 | Juan Pérez | juan.perez@cibertec.edu.pe |
| 87654321 | María García | maria.garcia@cibertec.edu.pe |
| 11223344 | Carlos López | carlos.lopez@cibertec.edu.pe |
| 44332211 | Ana Rodríguez | ana.rodriguez@cibertec.edu.pe |

### Vehículos Registrados
| Placa | Propietario | Modelo | Color |
|-------|-------------|--------|-------|
| ABC-123 | Juan Pérez | Toyota Corolla | Blanco |
| XYZ-789 | María García | Honda Civic | Azul |
| DEF-456 | Carlos López | Nissan Sentra | Rojo |

## 📋 Endpoints de la API

### 1. Información General

#### GET /
Obtiene información general de la API.

**Request:**
```bash
curl -X GET "http://localhost:3000/"
```

**Response:**
```json
{
  "message": "ParkSystem API funcionando correctamente",
  "version": "1.0.0",
  "endpoints": {
    "auth": {
      "login": "/api/auth/login",
      "logout": "/api/auth/logout",
      "refresh": "/api/auth/refresh"
    },
    "users": "/api/users/dni/:dni",
    "parking": {
      "spaces": "/api/parking/spaces",
      "entry": "/api/parking/entry",
      "exit": "/api/parking/exit"
    }
  }
}
```

### 2. Autenticación

#### POST /api/auth/login
Autentica un operador y devuelve tokens de acceso y renovación.

**Request:**
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'
```

**Response exitoso (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "08c2eba235021e361e7b197a543066f3...",
  "expires_in": 900,
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Administrador",
    "role": "admin"
  }
}
```

**Response error (401):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

#### POST /api/auth/logout
Cierra la sesión del usuario autenticado.

**Requiere autenticación:** ✅

**Request:**
```bash
curl -X POST "http://localhost:3000/api/auth/logout" \
  -H "Authorization: Bearer <tu_token_aqui>"
```

**Response exitoso (200):**
```json
{
  "success": true,
  "message": "Logout exitoso",
  "user": {
    "username": "admin",
    "name": "admin"
  }
}
```

**Response error (401):**
```json
{
  "success": false,
  "message": "Token de acceso requerido"
}
```

#### POST /api/auth/refresh
Renueva el access token usando un refresh token válido.

**Request:**
```bash
curl -X POST "http://localhost:3000/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "08c2eba235021e361e7b197a543066f3..."
  }'
```

**Response exitoso (200):**
```json
{
  "success": true,
  "message": "Token renovado exitosamente",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "token_type": "Bearer"
}
```

**Response error (400):**
```json
{
  "success": false,
  "message": "Refresh token es requerido"
}
```

**Response error (401):**
```json
{
  "success": false,
  "message": "Refresh token inválido"
}
```

### 3. Gestión de Usuarios

#### GET /api/users/dni/:dni
Consulta un usuario por su DNI.

**Requiere autenticación:** ✅

**Request:**
```bash
curl -X GET "http://localhost:3000/api/users/dni/12345678" \
  -H "Authorization: Bearer <tu_token_aqui>"
```

**Response exitoso (200):**
```json
{
  "success": true,
  "message": "Usuario encontrado",
  "user": {
    "id": 1,
    "dni": "12345678",
    "name": "Juan Pérez",
    "email": "juan.perez@cibertec.edu.pe",
    "vehicles": [
      {
        "id": 1,
        "user_id": 1,
        "license_plate": "ABC-123",
        "model": "Toyota Corolla",
        "color": "Blanco"
      }
    ]
  }
}
```

**Response error (404):**
```json
{
  "success": false,
  "message": "Usuario no encontrado con el DNI proporcionado"
}
```

**Response error (400) - DNI inválido:**
```json
{
  "success": false,
  "message": "DNI debe tener 8 dígitos numéricos"
}
```

### 4. Gestión de Estacionamiento

#### GET /api/parking/spaces
Obtiene todos los espacios de estacionamiento.

**Requiere autenticación:** ✅

**Request:**
```bash
curl -X GET "http://localhost:3000/api/parking/spaces" \
  -H "Authorization: Bearer <tu_token_aqui>"
```

**Response exitoso (200):**
```json
{
  "success": true,
  "message": "Espacios de estacionamiento obtenidos",
  "spaces": [
    {
      "id": 1,
      "space_code": "SS-01",
      "floor_level": "SS",
      "is_available": true
    },
    {
      "id": 2,
      "space_code": "SS-02",
      "floor_level": "SS",
      "is_available": true
    }
  ],
  "ss_spaces": [...],
  "s1_spaces": [...],
  "summary": {
    "total": 34,
    "available": 30,
    "occupied": 4
  }
}
```

#### POST /api/parking/entry
Registra el ingreso de un vehículo al estacionamiento.

**Requiere autenticación:** ✅

**Request:**
```bash
curl -X POST "http://localhost:3000/api/parking/entry" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token_aqui>" \
  -d '{
    "dni": "11223344",
    "license_plate": "TEST-123",
    "space_id": 1
  }'
```

**Response exitoso (201):**
```json
{
  "success": true,
  "message": "Ingreso registrado exitosamente",
  "session": {
    "id": 4,
    "user": {
      "dni": "11223344",
      "name": "Carlos López"
    },
    "vehicle": {
      "license_plate": "TEST-123",
      "model": "No especificado"
    },
    "space": {
      "code": "SS-01",
      "floor": "SS"
    },
    "entry_time": "2025-10-21T01:48:44.694Z"
  }
}
```

**Response error (400) - Espacio ocupado:**
```json
{
  "success": false,
  "message": "El espacio seleccionado no está disponible"
}
```

**Response error (404) - Usuario no encontrado:**
```json
{
  "success": false,
  "message": "Usuario no encontrado con el DNI proporcionado"
}
```

#### POST /api/parking/exit
Registra la salida de un vehículo del estacionamiento.

**Requiere autenticación:** ✅

**Request:**
```bash
curl -X POST "http://localhost:3000/api/parking/exit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token_aqui>" \
  -d '{
    "dni": "11223344",
    "license_plate": "TEST-123"
  }'
```

**Response exitoso (200):**
```json
{
  "success": true,
  "message": "Salida registrada exitosamente",
  "session": {
    "id": 4,
    "user": {
      "dni": "11223344",
      "name": "Carlos López"
    },
    "vehicle": {
      "license_plate": "TEST-123",
      "model": "No especificado"
    },
    "space": {
      "code": "SS-01",
      "floor": "SS"
    },
    "entry_time": "2025-10-21T01:48:44.694Z",
    "exit_time": "2025-10-21T01:48:57.715Z",
    "time_elapsed_hours": 1,
    "total_amount": 5
  }
}
```

**Response error (404) - Sesión no encontrada:**
```json
{
  "success": false,
  "message": "No se encontró una sesión activa para este vehículo"
}
```

## 🔒 Manejo de Errores de Autenticación

### Sin token
**Response (401):**
```json
{
  "success": false,
  "message": "Token de acceso requerido"
}
```

### Token inválido
**Response (403):**
```json
{
  "success": false,
  "message": "Token inválido"
}
```

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Credenciales inválidas |
| 403 | Forbidden - Token inválido |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

## 🧪 Ejemplos de Uso Completo

### Flujo completo: Login → Consultar usuario → Registrar ingreso → Registrar salida

```bash
# 1. Login
TOKEN=$(curl -s -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}' | \
  jq -r '.token')

# 2. Consultar usuario
curl -X GET "http://localhost:3000/api/users/dni/12345678" \
  -H "Authorization: Bearer $TOKEN"

# 3. Ver espacios disponibles
curl -X GET "http://localhost:3000/api/parking/spaces" \
  -H "Authorization: Bearer $TOKEN"

# 4. Registrar ingreso
curl -X POST "http://localhost:3000/api/parking/entry" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "dni": "12345678",
    "license_plate": "ABC-123",
    "space_id": 2
  }'

# 5. Registrar salida
curl -X POST "http://localhost:3000/api/parking/exit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "dni": "12345678",
    "license_plate": "ABC-123"
  }'
```

## 📝 Notas Importantes

1. **Tokens JWT**: Los tokens tienen una duración de 1 día (24 horas)
2. **Espacios de estacionamiento**: Hay 34 espacios distribuidos en 2 pisos (SS y S1)
3. **Cálculo de tarifas**: Se cobra S/5.00 por hora o fracción
4. **Vehículos nuevos**: Si un vehículo no está registrado, se crea automáticamente
5. **Validaciones**: Todos los endpoints validan los datos de entrada
6. **CORS**: La API tiene CORS habilitado para desarrollo

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas
- **CORS** - Cross-Origin Resource Sharing

---

**Versión:** 1.0.0  
**Última actualización:** Octubre 2024