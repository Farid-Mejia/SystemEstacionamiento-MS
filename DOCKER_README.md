# Sistema de Estacionamiento - Dockerización

Este documento explica cómo ejecutar el Sistema de Estacionamiento usando Docker y Docker Compose.

## Prerrequisitos

- Docker Desktop instalado y ejecutándose
- Docker Compose (incluido con Docker Desktop)
- Al menos 4GB de RAM disponible
- Puertos disponibles: 80, 3306, 8761, 8081, 8082, 8083, 8084

## Arquitectura de Servicios

El sistema está compuesto por los siguientes servicios:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `mysql` | 3306 | Base de datos MySQL 8.0 |
| `eureka-server` | 8761 | Servidor de descubrimiento de servicios |
| `ms-users` | 8081 | Microservicio de usuarios y autenticación |
| `ms-parking-sessions` | 8082 | Microservicio de sesiones de estacionamiento |
| `ms-parking-spaces` | 8083 | Microservicio de espacios de estacionamiento |
| `ms-visitors` | 8084 | Microservicio de visitantes |
| `frontend-react` | 80 | Aplicación web React |

## Comandos Principales

### 1. Construir y ejecutar todos los servicios

```bash
# Construir las imágenes y ejecutar todos los servicios
docker-compose up --build

# Ejecutar en segundo plano (detached mode)
docker-compose up --build -d
```

### 2. Ejecutar servicios específicos

```bash
# Solo la base de datos y Eureka
docker-compose up mysql eureka-server

# Solo los microservicios (requiere que MySQL y Eureka estén ejecutándose)
docker-compose up ms-users ms-parking-sessions ms-parking-spaces ms-visitors
```

### 3. Ver logs

```bash
# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs ms-users

# Seguir logs en tiempo real
docker-compose logs -f frontend-react
```

### 4. Detener servicios

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO: elimina datos de la BD!)
docker-compose down -v

# Detener y eliminar imágenes
docker-compose down --rmi all
```

### 5. Reconstruir servicios

```bash
# Reconstruir un servicio específico
docker-compose build ms-users

# Reconstruir sin usar caché
docker-compose build --no-cache

# Reconstruir y ejecutar
docker-compose up --build ms-users
```

## Configuración de Base de Datos

La base de datos MySQL se configura automáticamente con:

- **Host**: `mysql` (dentro de Docker) / `localhost:3306` (desde el host)
- **Base de datos**: `dv_parksystem`
- **Usuario**: `parksystem_user`
- **Contraseña**: `parksystem123`
- **Usuario root**: `root` / `root123`

### Conectar a la base de datos desde el host

```bash
mysql -h localhost -P 3306 -u parksystem_user -p
# Contraseña: parksystem123
```

## Acceso a los Servicios

Una vez que todos los servicios estén ejecutándose:

- **Aplicación Web**: http://localhost
- **Eureka Dashboard**: http://localhost:8761
- **API Usuarios**: http://localhost:8081
- **API Sesiones**: http://localhost:8082
- **API Espacios**: http://localhost:8083
- **API Visitantes**: http://localhost:8084

## Troubleshooting

### Problema: Puerto ya en uso

```bash
# Ver qué proceso está usando el puerto
lsof -i :8080

# Cambiar el puerto en docker-compose.yml
ports:
  - "8090:8080"  # Puerto host:Puerto contenedor
```

### Problema: Servicios no se conectan

1. Verificar que todos los servicios estén saludables:
```bash
docker-compose ps
```

2. Verificar logs de errores:
```bash
docker-compose logs | grep ERROR
```

3. Reiniciar servicios en orden:
```bash
docker-compose restart mysql
docker-compose restart eureka-server
docker-compose restart ms-users
```

### Problema: Base de datos no inicializa

```bash
# Eliminar volumen y recrear
docker-compose down -v
docker-compose up mysql
```

### Problema: Memoria insuficiente

Ajustar límites de memoria en docker-compose.yml:

```yaml
services:
  ms-users:
    # ... otras configuraciones
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

## Desarrollo

### Reconstruir después de cambios en el código

```bash
# Para microservicios Spring Boot
docker-compose build ms-users
docker-compose up ms-users

# Para frontend React
docker-compose build frontend-react
docker-compose up frontend-react
```

### Ejecutar en modo desarrollo

Para desarrollo, puedes ejecutar algunos servicios localmente y otros en Docker:

```bash
# Solo infraestructura (BD + Eureka)
docker-compose up mysql eureka-server

# Ejecutar microservicios localmente con:
# mvn spring-boot:run (en cada directorio de microservicio)
# npm start (en frontend-react)
```

## Limpieza

### Limpiar contenedores y volúmenes

```bash
# Eliminar contenedores parados
docker container prune

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar volúmenes no utilizados
docker volume prune

# Limpieza completa del sistema
docker system prune -a --volumes
```

## Monitoreo

### Ver estado de los servicios

```bash
# Estado de todos los contenedores
docker-compose ps

# Uso de recursos
docker stats

# Información detallada de un contenedor
docker inspect parksystem-users
```

### Health Checks

Todos los servicios incluyen health checks. Verificar estado:

```bash
# Ver health status
docker-compose ps

# Logs de health checks
docker-compose logs | grep health
```

## Notas Importantes

1. **Orden de inicio**: Los servicios tienen dependencias configuradas, pero en caso de problemas, iniciar en este orden:
   - mysql
   - eureka-server
   - ms-users
   - ms-parking-sessions, ms-parking-spaces, ms-visitors
   - frontend-react

2. **Persistencia**: Los datos de MySQL se persisten en un volumen Docker (`mysql_data`)

3. **Redes**: Todos los servicios están en la red `parksystem-network` para comunicación interna

4. **Seguridad**: Los Dockerfiles incluyen usuarios no-root para mayor seguridad

5. **Variables de entorno**: Configuradas para ambiente Docker, modificar según necesidades