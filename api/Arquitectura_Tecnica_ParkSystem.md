# Documento de Arquitectura Técnica - ParkSystem

## 1. Diseño de Arquitectura

```mermaid
graph TD
    A[Navegador del Usuario] --> B[Aplicación React Frontend]
    B --> C[Zustand Store]
    B --> D[Shadcn/UI Components]
    B --> E[API Services Layer]
    E --> F[Backend APIs - MySQL]
    F --> G[(Base de Datos MySQL)]

    subgraph "Capa Frontend"
        B
        C
        D
    end

    subgraph "Capa de Servicios"
        E
    end

    subgraph "Capa Backend"
        F
    end

    subgraph "Capa de Datos"
        G
    end
```

## 2. Descripción de Tecnologías

- **Frontend**: React\@19 + TypeScript + Vite + Tailwind CSS\@4

- **Estado Global**: Zustand con persistencia

- **Componentes UI**: Shadcn/ui + Lucide React

- **Notificaciones**: Sonner + SweetAlert2

- **Backend**: APIs REST con Node.js/Express

- **Base de Datos**: MySQL 8.0+

## 2.1 Configuración de Base de Datos

```env
MYSQL_URI=mysql://root:Lifeinmono77@localhost:3306/db_parking
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=Lifeinmono77
MYSQL_DATABASE=db_parking
```

## 3. Definiciones de Rutas

| Ruta           | Propósito                                                            |
| -------------- | -------------------------------------------------------------------- |
| /login         | Página de autenticación con DNI y contraseña                         |
| /dashboard     | Dashboard principal con visualización de espacios de estacionamiento |
| /vehicle-entry | Ingreso de vehículos con búsqueda de DNI y registro completo         |
| /vehicle-exit  | Confirmación de salida de vehículos                                  |
| /profile       | Perfil del usuario y configuraciones                                 |

## 4. Definiciones de API

### 4.1 API Principal

**Autenticación de usuarios**

```
POST /api/auth/login
```

Request:

| Nombre del Parámetro | Tipo del Parámetro | Es Requerido | Descripción            |
| -------------------- | ------------------ | ------------ | ---------------------- |
| username             | string             | true         | Usuario del sistema    |
| password             | string             | true         | Contraseña del usuario |

Response:

| Nombre del Parámetro | Tipo del Parámetro | Descripción                   |
| -------------------- | ------------------ | ----------------------------- |
| success              | boolean            | Estado de la respuesta        |
| token                | string             | Token JWT para autenticación  |
| user                 | object             | Datos del usuario autenticado |

Ejemplo de respuesta:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "dni": "12345678",
    "username": "admin",
    "first_name": "Juan Carlos",
    "paternal_last_name": "Pérez",
    "maternal_last_name": "García",
    "role": "ADMIN"
  }
}
```

**Estructura del Token JWT:**

```json
{
  "sub": "admin",
  "dni": "12345678",
  "roles": ["ROLE_ADMIN"],
  "iat": 1640995200,
  "exp": 1641081600
}
```

**Ejemplo de Token JWT para OPERATOR:**

```json
{
  "sub": "operator01",
  "dni": "87654321",
  "roles": ["ROLE_OPERATOR"],
  "iat": 1640995200,
  "exp": 1641081600
}

**Obtener información del usuario**

```

GET /api/users/profile

```

Headers:
```

Authorization: Bearer {token}

```

Response:

| Nombre del Parámetro | Tipo del Parámetro | Descripción                   |
| -------------------- | ------------------ | ----------------------------- |
| user                 | object             | Datos completos del usuario   |
| id                   | number             | ID del usuario                |
| dni                  | string             | DNI del usuario               |
| username             | string             | Nombre de usuario             |
| first_name           | string             | Nombres del usuario           |
| paternal_last_name   | string             | Apellido paterno              |
| maternal_last_name   | string             | Apellido materno              |
| role                 | string             | Rol del usuario (ADMIN, OPERATOR) |
| created_at           | string             | Fecha de creación             |

**Actualizar información del usuario**

```

PUT /api/users/profile

```

Headers:
```

Authorization: Bearer {token}

```

Request:

| Nombre del Parámetro | Tipo del Parámetro | Es Requerido | Descripción           |
| -------------------- | ------------------ | ------------ | --------------------- |
| first_name           | string             | true         | Nombres del usuario   |
| paternal_last_name   | string             | true         | Apellido paterno      |
| maternal_last_name   | string             | false        | Apellido materno      |

**Búsqueda de visitantes**

```

GET /api/visitors/search?dni={dni}

```

Response:

| Nombre del Parámetro | Tipo del Parámetro | Descripción                    |
| -------------------- | ------------------ | ------------------------------ |
| visitor              | object             | Datos del visitante encontrado |
| id                   | number             | ID del visitante               |
| dni                  | string             | DNI del visitante              |
| first_name           | string             | Nombres del visitante          |
| paternal_last_name   | string             | Apellido paterno               |
| maternal_last_name   | string             | Apellido materno               |

**Registro de visitantes**

```

POST /api/visitors

```

Request:

| Nombre del Parámetro | Tipo del Parámetro | Es Requerido | Descripción           |
| -------------------- | ------------------ | ------------ | --------------------- |
| dni                  | string             | true         | DNI del visitante     |
| first_name           | string             | true         | Nombres del visitante |
| paternal_last_name   | string             | true         | Apellido paterno      |
| maternal_last_name   | string             | true         | Apellido materno      |

**Gestión de espacios de estacionamiento**

```

GET /api/parking/spaces

```

Response:

| Nombre del Parámetro | Tipo del Parámetro | Descripción                            |
| -------------------- | ------------------ | -------------------------------------- |
| spaces               | array              | Lista de espacios con su estado        |
| id                   | number             | ID del espacio                         |
| space\_number        | number             | Número del espacio                     |
| floor                | string             | Piso del estacionamiento (SS/S1)       |
| is\_disabled\_space  | boolean            | Indica si es espacio para discapacidad |
| status               | string             | Estado: available/occupied/maintenance |

**Registro de sesión de estacionamiento**

```

POST /api/parking/sessions

```

Request:

| Nombre del Parámetro | Tipo del Parámetro | Es Requerido | Descripción                       |
| -------------------- | ------------------ | ------------ | --------------------------------- |
| license_plate        | string             | true         | Placa del vehículo                |
| visitor_id           | number             | true         | ID del visitante                  |
| parking_space_id     | number             | true         | ID del espacio de estacionamiento |

**Finalizar sesión de estacionamiento**

```

PUT /api/parking/sessions/{id}/exit

```

Request:

| Nombre del Parámetro | Tipo del Parámetro | Es Requerido | Descripción                    |
| -------------------- | ------------------ | ------------ | ------------------------------ |
| license_plate        | string             | true         | Placa del vehículo             |
| exit_time            | string             | true         | Hora de salida (ISO 8601)      |

**Búsqueda de sesiones activas**

```

GET /api/parking/sessions/active?license_plate={license_plate}

````

Response:

| Nombre del Parámetro | Tipo del Parámetro | Descripción              |
| -------------------- | ------------------ | ------------------------ |
| session              | object             | Sesión activa encontrada |
| id                   | number             | ID de la sesión          |
| license_plate        | string             | Placa del vehículo       |
| visitor              | object             | Datos del visitante      |
| parking_space        | object             | Datos del espacio        |
| entry_time           | string             | Hora de ingreso          |
| status               | string             | Estado de la sesión      |

## 5. Diagrama de Arquitectura del Servidor

```mermaid
graph TD
    A[Cliente / Frontend] --> B[Capa de Controladores]
    B --> C[Capa de Servicios]
    C --> D[Capa de Repositorio]
    D --> E[(Base de Datos MySQL)]

    subgraph Servidor
        B
        C
        D
    end
```

### 5.1 Autorización basada en roles

El sistema implementa autorización basada en roles utilizando Spring Security:

**Roles disponibles:**
- `ADMIN`: Acceso completo al sistema, gestión de usuarios y configuración
- `OPERATOR`: Operaciones de estacionamiento, gestión de visitantes y espacios

**Configuración de seguridad:**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/operator/**").hasAnyRole("OPERATOR", "ADMIN")
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt());
        return http.build();
    }
}
````

## 6. Modelo de Datos

### 6.1 Definición del Modelo de Datos

```mermaid
erDiagram
    USERS ||--o{ PARKING_SESSIONS : operates
    VISITORS ||--o{ PARKING_SESSIONS : visits
    PARKING_SPACES ||--o{ PARKING_SESSIONS : contains

    USERS {
        int id PK
        string dni UK
        string username UK
        string password
        string first_name
        string paternal_last_name
        string maternal_last_name
        string role
        timestamp created_at
        timestamp updated_at
    }

    VISITORS {
        int id PK
        string dni UK
        string first_name
        string paternal_last_name
        string maternal_last_name
        timestamp created_at
        timestamp updated_at
    }

    PARKING_SPACES {
        int id PK
        int space_number UK
        string floor
        boolean is_disabled_space
        string status
        timestamp created_at
        timestamp updated_at
    }

    PARKING_SESSIONS {
        int id PK
        string license_plate
        int visitor_id FK
        int parking_space_id FK
        timestamp entry_time
        timestamp exit_time
        int duration_seconds
        string status
        timestamp created_at
        timestamp updated_at
    }
```

### 6.2 Lenguaje de Definición de Datos

**Users Table (users)**

```sql
-- Users who operate the parking system
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(8) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    paternal_last_name VARCHAR(100) NOT NULL,
    maternal_last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'OPERATOR' CHECK (role IN ('ADMIN', 'OPERATOR')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for users
CREATE INDEX idx_users_dni ON users(dni);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_full_name ON users(first_name, paternal_last_name, maternal_last_name);
```

**Visitors Table (visitors)**

```sql
-- People who come to park
CREATE TABLE visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(8) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    paternal_last_name VARCHAR(50) NOT NULL,
    maternal_last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for visitors
CREATE INDEX idx_visitors_dni ON visitors(dni);
```

**Parking Spaces Table (parking_spaces)**

```sql
-- Catalog of available spaces
CREATE TABLE parking_spaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    space_number INT UNIQUE NOT NULL,
    floor VARCHAR(5) NOT NULL CHECK (floor IN ('SS', 'S1')),
    is_disabled_space BOOLEAN DEFAULT FALSE,
    status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for parking spaces
CREATE INDEX idx_parking_spaces_space_number ON parking_spaces(space_number);
CREATE INDEX idx_parking_spaces_floor ON parking_spaces(floor);
CREATE INDEX idx_parking_spaces_is_disabled_space ON parking_spaces(is_disabled_space);
CREATE INDEX idx_parking_spaces_status ON parking_spaces(status);
```

**Parking Sessions Table (parking_sessions)**

```sql
-- Record of entries and exits
CREATE TABLE parking_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(10) NOT NULL,
    visitor_id INT NOT NULL,
    parking_space_id INT NOT NULL,
    entry_time TIMESTAMP NOT NULL,
    exit_time TIMESTAMP NULL,
    duration_seconds INT NULL,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign keys
    FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE,
    FOREIGN KEY (parking_space_id) REFERENCES parking_spaces(id) ON DELETE CASCADE
);

-- Indexes for parking sessions
CREATE INDEX idx_parking_sessions_license_plate ON parking_sessions(license_plate);
CREATE INDEX idx_parking_sessions_visitor_id ON parking_sessions(visitor_id);
CREATE INDEX idx_parking_sessions_parking_space_id ON parking_sessions(parking_space_id);
CREATE INDEX idx_parking_sessions_status ON parking_sessions(status);
CREATE INDEX idx_parking_sessions_entry_time ON parking_sessions(entry_time DESC);
```

**Initial Data**

```sql
-- Insert parking spaces
INSERT INTO parking_spaces (space_number, floor, is_disabled_space, status) VALUES
-- SS Spaces (1-14)
(1, 'SS', TRUE, 'available'),   -- Space for people with disabilities
(2, 'SS', TRUE, 'available'),   -- Space for people with disabilities
(3, 'SS', FALSE, 'available'),
(4, 'SS', FALSE, 'available'),
(5, 'SS', FALSE, 'available'),
(6, 'SS', FALSE, 'available'),
(7, 'SS', FALSE, 'available'),
(8, 'SS', FALSE, 'available'),
(9, 'SS', FALSE, 'available'),
(10, 'SS', FALSE, 'available'),
(11, 'SS', FALSE, 'available'),
(12, 'SS', FALSE, 'available'),
(13, 'SS', FALSE, 'available'),
(14, 'SS', FALSE, 'available'),

-- S1 Spaces (15-40)
(15, 'S1', TRUE, 'available'),   -- Space for people with disabilities
(16, 'S1', TRUE, 'available'),   -- Space for people with disabilities
(17, 'S1', FALSE, 'available'),
(18, 'S1', FALSE, 'available'),
(19, 'S1', FALSE, 'available'),
(20, 'S1', FALSE, 'available'),
(21, 'S1', FALSE, 'available'),
(22, 'S1', FALSE, 'available'),
(23, 'S1', FALSE, 'available'),
(24, 'S1', FALSE, 'available'),
(25, 'S1', FALSE, 'available'),
(26, 'S1', FALSE, 'available'),
(27, 'S1', FALSE, 'available'),
(28, 'S1', FALSE, 'available'),
(29, 'S1', FALSE, 'available'),
(30, 'S1', FALSE, 'available'),
(31, 'S1', FALSE, 'available'),
(32, 'S1', FALSE, 'available'),
(33, 'S1', FALSE, 'available'),
(34, 'S1', FALSE, 'available'),
(35, 'S1', FALSE, 'available'),
(36, 'S1', FALSE, 'available'),
(37, 'S1', FALSE, 'available'),
(38, 'S1', FALSE, 'available'),
(39, 'S1', FALSE, 'available'),
(40, 'S1', FALSE, 'available');

-- Datos iniciales para usuarios
INSERT INTO users (dni, username, password, first_name, paternal_last_name, maternal_last_name, role) VALUES
('12345678', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Juan Carlos', 'Pérez', 'García', 'ADMIN'),
('87654321', 'operator01', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'María Elena', 'López', 'Martínez', 'OPERATOR'),
('11223344', 'operator02', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Carlos Alberto', 'Ramírez', 'Torres', 'OPERATOR');

-- Insert some test visitors
INSERT INTO visitors (dni, first_name, paternal_last_name, maternal_last_name) VALUES
('11111111', 'Juan Carlos', 'Pérez', 'García'),
('22222222', 'María Elena', 'López', 'Martínez'),
('33333333', 'Carlos Alberto', 'Rodríguez', 'Fernández');
```
