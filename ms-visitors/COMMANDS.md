# 🛠️ Comandos Útiles y Troubleshooting - MS-Visitors

## 📋 Índice

1. [Comandos de Ejecución](#comandos-de-ejecución)
2. [Comandos de Base de Datos](#comandos-de-base-de-datos)
3. [Comandos de Testing](#comandos-de-testing)
4. [Troubleshooting](#troubleshooting)
5. [Logs y Debugging](#logs-y-debugging)
6. [Comandos de Maven](#comandos-de-maven)

---

## 🚀 Comandos de Ejecución

### Ejecutar el microservicio

```bash
# Con Maven Wrapper (recomendado)
cd ms-visitors
./mvnw spring-boot:run

# Con Maven instalado
mvn spring-boot:run

# Con perfil de desarrollo
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Con perfil de producción
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod

# En background
nohup ./mvnw spring-boot:run &

# Detener proceso en background
ps aux | grep ms-visitors
kill -9 <PID>
```

### Verificar puertos

```bash
# Ver qué está corriendo en el puerto 9001
lsof -i :9001

# Ver todos los servicios del sistema
lsof -i :8761  # Eureka
lsof -i :8000  # Gateway
lsof -i :9000  # ms-users
lsof -i :9001  # ms-visitors

# Matar proceso en puerto específico
kill -9 $(lsof -ti:9001)
```

---

## 💾 Comandos de Base de Datos

### Crear base de datos

```bash
# Conectar a MySQL
mysql -u root -p

# Dentro de MySQL
CREATE DATABASE db_visitors;
USE db_visitors;
SHOW TABLES;
```

### Ejecutar script de inicialización

```bash
# Desde terminal
mysql -u root -p < database/init.sql

# O copiar y pegar en MySQL Workbench
```

### Verificar datos

```sql
-- Ver todas las tablas
SHOW TABLES;

-- Describir estructura de tabla visitors
DESCRIBE visitors;

-- Ver todos los visitantes
SELECT * FROM visitors;

-- Buscar por DNI
SELECT * FROM visitors WHERE dni = '12345678';

-- Contar visitantes
SELECT COUNT(*) FROM visitors;

-- Ver últimos visitantes creados
SELECT * FROM visitors ORDER BY created_at DESC LIMIT 10;
```

### Limpiar datos de prueba

```sql
-- Eliminar todos los datos (cuidado!)
TRUNCATE TABLE visitors;

-- Resetear auto increment
ALTER TABLE visitors AUTO_INCREMENT = 1;

-- Eliminar visitante específico
DELETE FROM visitors WHERE id = 1;
```

---

## 🧪 Comandos de Testing

### Testing con cURL

```bash
# 1. Login para obtener token
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq

# 2. Guardar token en variable (bash)
TOKEN=$(curl -s -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

echo $TOKEN

# 3. Crear visitante
curl -X POST http://localhost:8000/api/visitors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "firstName": "Juan",
    "paternalLastName": "Pérez",
    "maternalLastName": "García"
  }' \
  | jq

# 4. Buscar por DNI
curl -X GET http://localhost:8000/api/visitors/dni/12345678 \
  -H "Authorization: Bearer $TOKEN" \
  | jq

# 5. Listar todos
curl -X GET http://localhost:8000/api/visitors \
  -H "Authorization: Bearer $TOKEN" \
  | jq

# 6. Actualizar visitante
curl -X PUT http://localhost:8000/api/visitors/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "firstName": "Juan Carlos",
    "paternalLastName": "Pérez",
    "maternalLastName": "García"
  }' \
  | jq

# 7. Eliminar visitante
curl -X DELETE http://localhost:8000/api/visitors/1 \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

### Testing sin autenticación (debe fallar)

```bash
# Sin token - debe retornar 401
curl -X GET http://localhost:8000/api/visitors/dni/12345678

# Token inválido - debe retornar 401
curl -X GET http://localhost:8000/api/visitors/dni/12345678 \
  -H "Authorization: Bearer token_invalido"
```

### Testing con Postman

```bash
# Exportar colección de Postman (crear archivo)
# Import este JSON en Postman:
```

---

## 🔍 Troubleshooting

### Problema 1: "Unauthorized" (401)

**Síntomas:**
```json
{
  "success": false,
  "message": "No autorizado: ...",
  "data": null
}
```

**Soluciones:**

```bash
# 1. Verificar que el token es válido
echo $TOKEN

# 2. Verificar que jwt.secret es igual en ambos microservicios
# ms-users/src/main/resources/application.yml
grep -A2 "jwt:" ms-users/src/main/resources/application.yml

# ms-visitors/src/main/resources/application.yml
grep -A2 "jwt:" ms-visitors/src/main/resources/application.yml

# 3. Generar nuevo token
TOKEN=$(curl -s -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

# 4. Verificar logs
tail -f logs/spring.log
```

### Problema 2: "Forbidden" (403)

**Síntomas:**
```
Access Denied
```

**Soluciones:**

```bash
# 1. Verificar rol del usuario
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq '.user.role'

# 2. Ver logs para verificar qué rol se extrajo del token
tail -f logs/spring.log | grep "Rol extraído"

# 3. Verificar anotaciones @PreAuthorize en el controller
grep -r "@PreAuthorize" src/main/java/
```

### Problema 3: "Service Unavailable" (503)

**Síntomas:**
```
Connection refused / Service unavailable
```

**Soluciones:**

```bash
# 1. Verificar que Eureka está corriendo
curl http://localhost:8761

# 2. Verificar que ms-visitors está registrado en Eureka
curl http://localhost:8761/eureka/apps | grep -i visitors

# 3. Verificar que el servicio está corriendo
lsof -i :9001

# 4. Reiniciar servicios en orden:
# a) Eureka Server
# b) ms-users
# c) ms-visitors
# d) API Gateway
```

### Problema 4: Error de conexión a Base de Datos

**Síntomas:**
```
Communications link failure
Access denied for user
```

**Soluciones:**

```bash
# 1. Verificar que MySQL está corriendo
mysql -u root -p

# 2. Verificar que la BD existe
mysql -u root -p -e "SHOW DATABASES;" | grep visitors

# 3. Crear la BD si no existe
mysql -u root -p -e "CREATE DATABASE db_visitors;"

# 4. Verificar credenciales en application.yml
cat src/main/resources/application.yml | grep -A5 datasource

# 5. Probar conexión directa
mysql -u root -p db_visitors -e "SHOW TABLES;"
```

### Problema 5: Puerto ya en uso

**Síntomas:**
```
Port 9001 is already in use
```

**Soluciones:**

```bash
# 1. Ver qué proceso está usando el puerto
lsof -i :9001

# 2. Matar el proceso
kill -9 $(lsof -ti:9001)

# 3. O cambiar el puerto en application.yml
# server:
#   port: 9002
```

---

## 📝 Logs y Debugging

### Ver logs en tiempo real

```bash
# Ver logs de la aplicación
tail -f logs/spring.log

# Ver solo errores
tail -f logs/spring.log | grep ERROR

# Ver logs de SQL
tail -f logs/spring.log | grep "Hibernate:"

# Ver logs de autenticación
tail -f logs/spring.log | grep "JWT"
```

### Aumentar nivel de logging

```yaml
# En application.yml
logging:
  level:
    com.cibertec: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

### Debug remoto

```bash
# Ejecutar con debug habilitado
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# Conectar desde IntelliJ IDEA o VS Code al puerto 5005
```

---

## 🔨 Comandos de Maven

### Compilar

```bash
# Compilar sin tests
./mvnw clean compile

# Compilar con tests
./mvnw clean install

# Saltar tests
./mvnw clean install -DskipTests
```

### Ejecutar tests

```bash
# Todos los tests
./mvnw test

# Test específico
./mvnw test -Dtest=VisitorServiceTest

# Con cobertura
./mvnw clean test jacoco:report
```

### Empaquetar

```bash
# Crear JAR
./mvnw clean package

# JAR sin tests
./mvnw clean package -DskipTests

# El JAR estará en: target/ms-visitors-0.0.1-SNAPSHOT.jar

# Ejecutar el JAR
java -jar target/ms-visitors-0.0.1-SNAPSHOT.jar
```

### Limpiar

```bash
# Limpiar compilaciones
./mvnw clean

# Limpiar todo incluyendo dependencias
./mvnw clean dependency:purge-local-repository
```

---

## 🌐 Verificar Servicios

### Health Check

```bash
# Verificar que el servicio está vivo
curl http://localhost:9001/actuator/health

# Si actuator está habilitado
curl http://localhost:9001/actuator/info
curl http://localhost:9001/actuator/metrics
```

### Verificar Eureka

```bash
# Dashboard de Eureka
open http://localhost:8761

# API de Eureka
curl http://localhost:8761/eureka/apps

# Verificar ms-visitors
curl http://localhost:8761/eureka/apps/MS-VISITORS
```

### Verificar API Gateway

```bash
# Health check
curl http://localhost:8000/actuator/health

# Rutas configuradas
curl http://localhost:8000/actuator/gateway/routes
```

---

## 📊 Monitoreo

### Verificar uso de recursos

```bash
# CPU y memoria del proceso Java
ps aux | grep ms-visitors

# Top con filtro
top -p $(pgrof ms-visitors)

# Conexiones de red
netstat -an | grep 9001
```

### Verificar conexiones a BD

```sql
-- Ver conexiones activas
SHOW PROCESSLIST;

-- Ver estado de tablas
SHOW TABLE STATUS FROM db_visitors;

-- Ver tamaño de BD
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'db_visitors'
GROUP BY table_schema;
```

---

## 🔄 Scripts Útiles

### Script de inicio completo

```bash
#!/bin/bash
# start-visitors.sh

echo "🚀 Iniciando ms-visitors..."

# Verificar Java
if ! command -v java &> /dev/null; then
    echo "❌ Java no encontrado"
    exit 1
fi

# Verificar MySQL
if ! mysql -u root -p -e "SELECT 1;" &> /dev/null; then
    echo "❌ MySQL no está corriendo o credenciales incorrectas"
    exit 1
fi

# Crear BD si no existe
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS db_visitors;"

# Iniciar servicio
cd ms-visitors
./mvnw spring-boot:run

echo "✅ ms-visitors iniciado en puerto 9001"
```

### Script de verificación

```bash
#!/bin/bash
# check-services.sh

echo "🔍 Verificando servicios..."

# Eureka
if curl -s http://localhost:8761 > /dev/null; then
    echo "✅ Eureka Server - OK"
else
    echo "❌ Eureka Server - DOWN"
fi

# Gateway
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ API Gateway - OK"
else
    echo "❌ API Gateway - DOWN"
fi

# ms-users
if curl -s http://localhost:9000 > /dev/null; then
    echo "✅ ms-users - OK"
else
    echo "❌ ms-users - DOWN"
fi

# ms-visitors
if curl -s http://localhost:9001 > /dev/null; then
    echo "✅ ms-visitors - OK"
else
    echo "❌ ms-visitors - DOWN"
fi
```

---

## 📚 Recursos Adicionales

### Documentación

- [README.md](README.md) - Guía completa
- [QUICK_START.md](QUICK_START.md) - Inicio rápido
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura detallada
- [DIAGRAMS.md](DIAGRAMS.md) - Diagramas visuales

### Archivos de configuración

- `application.yml` - Configuración principal
- `application-dev.yml` - Desarrollo
- `application-prod.yml` - Producción
- `pom.xml` - Dependencias Maven

### Testing

- `api-tests.http` - Ejemplos de peticiones HTTP
- Use Postman, Insomnia o REST Client de VS Code

---

## ✅ Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] ¿Está MySQL corriendo?
- [ ] ¿Existe la base de datos `db_visitors`?
- [ ] ¿Está Eureka Server corriendo en :8761?
- [ ] ¿Está ms-users corriendo en :9000?
- [ ] ¿Está API Gateway corriendo en :8000?
- [ ] ¿El `jwt.secret` es igual en ms-users y ms-visitors?
- [ ] ¿El token JWT es válido y no ha expirado?
- [ ] ¿El usuario tiene el rol correcto?
- [ ] ¿Se pueden ver logs de error?

---

**¡Buena suerte! 🚀**
