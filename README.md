# SystemEstacionamiento-MS

## 📋 Descripción del Proyecto

**SystemEstacionamiento-MS** es un sistema integral de gestión de estacionamientos desarrollado con arquitectura de microservicios. El sistema permite administrar espacios de estacionamiento, registrar sesiones de vehículos, gestionar usuarios y generar reportes detallados con visualizaciones interactivas.

## 🏗️ Arquitectura del Sistema

El proyecto implementa una arquitectura de microservicios distribuida que incluye:

- **Frontend React**: Interfaz de usuario moderna y responsiva
- **API Gateway**: Punto de entrada único para todas las peticiones
- **Eureka Server**: Registro y descubrimiento de servicios
- **Microservicios Spring Boot**: Servicios especializados por dominio
- **Base de Datos MySQL**: Almacenamiento persistente
- **Apache Kafka**: Mensajería asíncrona entre servicios

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Recharts** para visualización de datos
- **Zustand** para gestión de estado
- **React Router** para navegación
- **Radix UI** para componentes accesibles

### Backend

- **Spring Boot 3.5.6** (Java 21)
- **Spring Cloud** para microservicios
- **MySQL** como base de datos principal
- **Apache Kafka** para mensajería
- **JWT** para autenticación
- **Maven** para gestión de dependencias

### DevOps y Herramientas

- **Docker** para containerización
- **Eureka** para service discovery
- **API Gateway** para enrutamiento
- **ESLint** para calidad de código

## ✨ Funcionalidades Principales

### 🚗 Gestión de Estacionamiento

- **Registro de entrada y salida** de vehículos
- **Asignación automática** de espacios disponibles
- **Gestión de espacios** para personas con discapacidad
- **Control de ocupación** por pisos (Sótano y Piso 1)
- **Validación en tiempo real** de disponibilidad

### 👥 Gestión de Usuarios

- **Autenticación segura** con JWT
- **Registro de visitantes** y propietarios
- **Gestión de vehículos** por usuario
- **Perfiles de usuario** personalizables

### 📊 Reportes y Analytics

- **Dashboard interactivo** con métricas en tiempo real
- **Gráficos de ocupación** por períodos
- **Estadísticas de duración** promedio
- **Distribución por horas** pico
- **Exportación a Excel/CSV** de reportes
- **KPIs automatizados** del sistema

### 🏢 Administración de Espacios

- **Espacios reservados** para discapacidad
- **Estados dinámicos**: Disponible, Ocupado, Mantenimiento
- **Gestión de tarifas** por tiempo de uso

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Java 21+**
- **MySQL 8.0+**
- **Apache Kafka**
- **Maven 3.8+**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/SystemEstacionamiento-MS.git
cd SystemEstacionamiento-MS
```

### 2. Configurar Kafka

```bash
# Iniciar Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Iniciar Kafka
bin/kafka-server-start.sh config/server.properties
```

### 3. Ejecutar Microservicios

#### Eureka Server

```bash
cd eureka-server
mvn spring-boot:run
```

#### API Gateway

```bash
cd api-gateway
mvn spring-boot:run
```

#### Microservicios

```bash
# Microservicio de Usuarios
cd ms-users
mvn spring-boot:run

# Microservicio de Espacios
cd ms-parking-spaces
mvn spring-boot:run

# Microservicio de Sesiones
cd ms-parking-sessions
mvn spring-boot:run

# Microservicio de Visitantes
cd ms-visitors
mvn spring-boot:run
```

#### Frontend React

```bash
cd frontend-react
npm install
npm start
```

## 🌐 Endpoints Principales

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Espacios de Estacionamiento

- `GET /api/parking-spaces` - Obtener todos los espacios
- `GET /api/parking-spaces/stats` - Estadísticas de espacios
- `PUT /api/parking-spaces/{id}/status` - Actualizar estado

### Sesiones de Estacionamiento

- `POST /api/parking-sessions` - Crear nueva sesión
- `PUT /api/parking-sessions/{id}/exit` - Registrar salida
- `GET /api/parking-sessions/active` - Sesiones activas

## 📁 Estructura del Proyecto

```
SystemEstacionamiento-MS/
├── api-gateway/                  # Spring Cloud Gateway
├── eureka-server/               # Service Discovery
├── frontend-react/              # Aplicación React
├── ms-users/                    # Microservicio de Usuarios
├── ms-parking-spaces/           # Microservicio de Espacios
├── ms-parking-sessions/         # Microservicio de Sesiones
├── ms-visitors/                 # Microservicio de Visitantes
├── data_kafka/                  # Datos de Kafka
└── frontend-legacy/             # Frontend legacy (HTML)
```

## 🔧 Configuración de Desarrollo

### Variables de Entorno

```bash
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=parking_system
DB_USER=root
DB_PASSWORD=password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
```

### Puertos por Defecto

- **Frontend React**: http://localhost:3000
- **Eureka Server**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **Microservicios**: 8081-8084

## 📈 Métricas y Monitoreo

El sistema incluye:

- **Dashboard en tiempo real** con KPIs
- **Métricas de ocupación** por piso
- **Análisis de patrones** de uso
- **Alertas de capacidad** máxima
- **Reportes automatizados** diarios/mensuales

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Desarrollado por

**Proyecto Académico - CIBERTEC**  
Ciclo 6 - Aplicaciones Web II

---

⭐ Si este proyecto te fue útil, ¡no olvides darle una estrella!
