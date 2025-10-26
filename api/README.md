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

La API se ejecutará en: **<http://localhost:3000>**

## 🔐 Autenticación

La API utiliza autenticación JWT (JSON Web Tokens). Para acceder a los endpoints protegidos, necesitas:

1. Hacer login con credenciales válidas
2. Usar el token recibido en el header `Authorization: Bearer <token>`

## 📊 Datos de Prueba

### Credenciales de Operadores

| Usuario    | Contraseña | Rol      |
| ---------- | ---------- | -------- |
| admin      | 123456     | admin    |
| operador01 | 123456     | operator |
| operador02 | 123456     | operator |

### DNIs de Visitantes de Prueba

| DNI      | Nombres        | Apellido Paterno | Apellido Materno |
| -------- | -------------- | ---------------- | ---------------- |
| 11111111 | Juan Carlos    | Pérez            | García           |
| 22222222 | María Elena    | López            | Martínez         |
| 33333333 | Carlos Alberto | Rodríguez        | Fernández        |

### Vehículos Registrados

| Placa   | Propietario                        | Modelo         | Color  |
| ------- | ---------------------------------- | -------------- | ------ |
| ABC-123 | Juan Carlos Pérez García           | Toyota Corolla | Blanco |
| XYZ-789 | María Elena López Martínez         | Honda Civic    | Azul   |
| DEF-456 | Carlos Alberto Rodríguez Fernández | Nissan Sentra  | Rojo   |

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
    "auth": "/api/auth/login",
    "visitors": "/api/visitors/dni/:dni",
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

Autentica un operador y devuelve un token JWT.

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "first_name": "Juan Carlos",
    "paternal_last_name": "Pérez",
    "maternal_last_name": "García",
    "role": "ADMIN"
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

### 3. Gestión de Visitantes

#### GET /api/visitors/dni/:dni

Consulta un visitante por su DNI.

**Requiere autenticación:** ✅

**Request:**

```bash
curl -X GET "http://localhost:3000/api/visitors/dni/11111111" \
  -H "Authorization: Bearer <tu_token_aqui>"
```

**Response exitoso (200):**

```json
{
  "success": true,
  "message": "Visitante encontrado",
  "visitor": {
    "id": 1,
    "dni": "11111111",
    "first_name": "Juan Carlos",
    "paternal_last_name": "Pérez",
    "maternal_last_name": "García"
  }
}
```

**Response error (404):**

```json
{
  "success": false,
  "message": "Visitante no encontrado con el DNI proporcionado"
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
      "space_number": 1,
      "floor": "SS",
      "is_disabled_space": true,
      "status": "available"
    },
    {
      "id": 2,
      "space_number": 2,
      "floor": "SS",
      "is_disabled_space": true,
      "status": "available"
    }
  ],
  "ss_spaces": [...],
  "s1_spaces": [...],
  "summary": {
    "total": 40,
    "available": 36,
    "occupied": 4,
    "maintenance": 0
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
    "dni": "11111111",
    "license_plate": "ABC-123",
    "parking_space_id": 1
  }'
```

**Response exitoso (201):**

```json
{
  "success": true,
  "message": "Ingreso registrado exitosamente",
  "session": {
    "id": 4,
    "visitor": {
      "dni": "11111111",
      "first_name": "Juan Carlos",
      "paternal_last_name": "Pérez",
      "maternal_last_name": "García"
    },
    "vehicle": {
      "license_plate": "ABC-123",
      "model": "Toyota Corolla"
    },
    "parking_space": {
      "id": 1,
      "space_number": 1,
      "floor": "SS",
      "is_disabled_space": true
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

**Response error (404) - Visitante no encontrado:**

```json
{
  "success": false,
  "message": "Visitante no encontrado con el DNI proporcionado"
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
    "dni": "11111111",
    "license_plate": "ABC-123"
  }'
```

**Response exitoso (200):**

```json
{
  "success": true,
  "message": "Salida registrada exitosamente",
  "session": {
    "id": 4,
    "visitor": {
      "dni": "11111111",
      "first_name": "Juan Carlos",
      "paternal_last_name": "Pérez",
      "maternal_last_name": "García"
    },
    "vehicle": {
      "license_plate": "ABC-123",
      "model": "Toyota Corolla"
    },
    "parking_space": {
      "id": 1,
      "space_number": 1,
      "floor": "SS",
      "is_disabled_space": true
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

| Código | Descripción                                |
| ------ | ------------------------------------------ |
| 200    | OK - Solicitud exitosa                     |
| 201    | Created - Recurso creado exitosamente      |
| 400    | Bad Request - Datos inválidos              |
| 401    | Unauthorized - Credenciales inválidas      |
| 403    | Forbidden - Token inválido                 |
| 404    | Not Found - Recurso no encontrado          |
| 500    | Internal Server Error - Error del servidor |

## 🧪 Ejemplos de Uso Completo

### Flujo completo: Login → Consultar usuario → Registrar ingreso → Registrar salida

```bash
# 1. Login
TOKEN=$(curl -s -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "123456"}' | \
  jq -r '.token')

# 2. Consultar visitante
curl -X GET "http://localhost:3000/api/visitors/dni/11111111" \
  -H "Authorization: Bearer $TOKEN"

# 3. Ver espacios disponibles
curl -X GET "http://localhost:3000/api/parking/spaces" \
  -H "Authorization: Bearer $TOKEN"

# 4. Registrar ingreso
curl -X POST "http://localhost:3000/api/parking/entry" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "dni": "11111111",
    "license_plate": "ABC-123",
    "parking_space_id": 2
  }'

# 5. Registrar salida
curl -X POST "http://localhost:3000/api/parking/exit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "dni": "11111111",
    "license_plate": "ABC-123"
  }'
```

## 📝 Notas Importantes

1. **Tokens JWT**: Los tokens tienen una duración de 1 día (24 horas)
2. **Espacios de estacionamiento**: Hay 40 espacios distribuidos en 2 pisos (SS: 1-14, S1: 15-40)
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

**Versión:** 1.0.0\
**Última actualización:** Octubre 2024
