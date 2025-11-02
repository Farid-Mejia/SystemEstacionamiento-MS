# GitHub Actions CI/CD Workflows

Este directorio contiene los workflows de CI/CD para todos los servicios del sistema de estacionamiento.

## Workflows Disponibles

### 1. Frontend React
- **Archivo**: `frontend-react/.github/workflows/ci-frontend.yml`
- **Trigger**: Cambios en `frontend-react/**`
- **Tecnología**: Node.js 20, npm
- **Funcionalidades**: Format, Lint, Build, Docker

### 2. Eureka Server
- **Archivo**: `ci-eureka-server.yml`
- **Trigger**: Cambios en `eureka-server/**`
- **Tecnología**: Java 21, Maven
- **Funcionalidades**: Tests, Build, Docker

### 3. Microservicio de Usuarios
- **Archivo**: `ci-ms-users.yml`
- **Trigger**: Cambios en `ms-users/**`
- **Tecnología**: Java 21, Maven
- **Funcionalidades**: Tests, Build, Docker

### 4. Microservicio de Visitantes
- **Archivo**: `ci-ms-visitors.yml`
- **Trigger**: Cambios en `ms-visitors/**`
- **Tecnología**: Java 21, Maven
- **Funcionalidades**: Tests, Build, Docker

### 5. Microservicio de Espacios de Estacionamiento
- **Archivo**: `ci-ms-parking-spaces.yml`
- **Trigger**: Cambios en `ms-parking-spaces/**`
- **Tecnología**: Java 21, Maven
- **Funcionalidades**: Tests, Build, Docker

### 6. Microservicio de Sesiones de Estacionamiento
- **Archivo**: `ci-ms-parking-sessions.yml`
- **Trigger**: Cambios en `ms-parking-sessions/**`
- **Tecnología**: Java 21, Maven
- **Funcionalidades**: Tests, Build, Docker

## Configuración de Secrets

Para que los workflows funcionen correctamente, necesitas configurar los siguientes secrets en GitHub:

### Secrets Comunes
- `DOCKER_USER`: Usuario de Docker Hub
- `DOCKER_PASSWORD`: Contraseña de Docker Hub

### Secrets por Proyecto
- `PROJECT_NAME`: Nombre del proyecto para frontend-react
- `EUREKA_PROJECT_NAME`: Nombre del proyecto para Eureka Server
- `MS_USERS_PROJECT_NAME`: Nombre del proyecto para ms-users
- `MS_VISITORS_PROJECT_NAME`: Nombre del proyecto para ms-visitors
- `MS_PARKING_SPACES_PROJECT_NAME`: Nombre del proyecto para ms-parking-spaces
- `MS_PARKING_SESSIONS_PROJECT_NAME`: Nombre del proyecto para ms-parking-sessions

### Secrets Adicionales (solo para frontend)
- `ENV_FILE`: Archivo de variables de entorno codificado en base64

## Características de los Workflows

### Triggers
- Todos los workflows se ejecutan cuando hay push a la rama `main`
- Cada workflow solo se ejecuta cuando hay cambios en su directorio específico

### Versionado Semántico
- Utiliza `PaulHatch/semantic-version@v4.0.3`
- Patrón mayor: "mayor"
- Patrón menor: "feat"
- Formato: `${major}.${minor}.${increment}`

### Docker
- Construye dos tags: versión específica y `latest`
- Utiliza Docker Buildx para construcción optimizada
- Sube las imágenes a Docker Hub

### Cache
- Los workflows de Java utilizan cache de Maven para optimizar tiempos de construcción
- Cache key basado en hash de archivos `pom.xml`

## Flujo de Trabajo

1. **Checkout**: Descarga el código del repositorio
2. **Setup**: Configura el entorno (Java 21 para microservicios, Node.js 20 para frontend)
3. **Cache**: Restaura dependencias cacheadas
4. **Test**: Ejecuta las pruebas unitarias
5. **Build**: Construye la aplicación
6. **Version**: Genera versión semántica
7. **Docker**: Construye y sube imágenes Docker

## Notas Importantes

- Los workflows de Java utilizan `mvn clean test` para pruebas y `mvn clean package -DskipTests` para construcción
- El frontend utiliza `npm run format`, `npm run lint` y `npm run build`
- Todos los workflows requieren permisos de escritura en el repositorio
- Las imágenes Docker se construyen desde el directorio específico de cada servicio