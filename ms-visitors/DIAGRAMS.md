# Diagramas de Arquitectura - MS-Visitors

## 1. Arquitectura General del Sistema

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          SISTEMA DE ESTACIONAMIENTO                        │
│                                CIBERTEC                                    │
└────────────────────────────────────────────────────────────────────────────┘

                             ┌──────────────────┐
                             │  Cliente Web/App │
                             │   (Frontend)     │
                             └────────┬─────────┘
                                      │
                                      │ HTTP/HTTPS
                                      ↓
                             ┌──────────────────┐
                             │   API Gateway    │
                             │   Port: 8000     │
                             │                  │
                             │  Routes:         │
                             │  /api/users/**   │
                             │  /api/visitors/**│
                             └────────┬─────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │        Service Discovery          │
                    │                                   │
                    ↓                                   ↓
          ┌──────────────────┐              ┌──────────────────┐
          │    ms-users      │              │   ms-visitors    │
          │   Port: 9000     │              │   Port: 9001     │
          │                  │              │                  │
          │  - Login         │              │  - CRUD Visitors │
          │  - Generate JWT  │              │  - Validate JWT  │
          │  - User CRUD     │              │  - Authorization │
          └────────┬─────────┘              └────────┬─────────┘
                   │                                 │
                   │                                 │
          ┌────────┴─────────┐              ┌───────┴──────────┐
          │  DB: parksystem_ │              │  DB: db_visitors │
          │     usersdb      │              │                  │
          └──────────────────┘              └──────────────────┘

                    ┌─────────────────────────────┐
                    │      Eureka Server          │
                    │       Port: 8761            │
                    │   (Service Registry)        │
                    └─────────────────────────────┘
                               ↑
                    ┌──────────┼──────────┐
                    │          │          │
              (register)  (register)  (register)
                    │          │          │
            ┌───────┴──┐   ┌──┴─────┐   ┌┴──────────┐
            │ Gateway  │   │ ms-    │   │ ms-       │
            │          │   │ users  │   │ visitors  │
            └──────────┘   └────────┘   └───────────┘
```

## 2. Flujo de Autenticación JWT

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE AUTENTICACIÓN JWT                           │
└─────────────────────────────────────────────────────────────────────────┘

PASO 1: LOGIN Y GENERACIÓN DE TOKEN
════════════════════════════════════

   ┌────────┐                                              ┌──────────┐
   │ Client │                                              │ ms-users │
   └───┬────┘                                              └────┬─────┘
       │                                                        │
       │  POST /api/users/login                                │
       │  { username, password }                               │
       ├──────────────────────────────────────────────────────→│
       │                                                        │
       │                                          ┌─────────────┴──────────┐
       │                                          │ 1. Validate credentials│
       │                                          │ 2. Generate JWT        │
       │                                          │    - Add username      │
       │                                          │    - Add role          │
       │                                          │    - Add userId        │
       │                                          │    - Sign with secret  │
       │                                          └─────────────┬──────────┘
       │                                                        │
       │  Response: { token: "eyJhbG...", user: {...} }        │
       │←──────────────────────────────────────────────────────┤
       │                                                        │
   ┌───┴────┐                                              ┌────┴─────┐
   │ Client │                                              │ ms-users │
   │ (Save  │                                              └──────────┘
   │ token) │
   └────────┘


PASO 2: USO DEL TOKEN EN MS-VISITORS
═════════════════════════════════════

   ┌────────┐                          ┌─────────┐                  ┌────────────┐
   │ Client │                          │ Gateway │                  │ms-visitors │
   └───┬────┘                          └────┬────┘                  └─────┬──────┘
       │                                    │                             │
       │  GET /api/visitors/dni/12345678    │                             │
       │  Authorization: Bearer eyJhbG...   │                             │
       ├───────────────────────────────────→│                             │
       │                                    │                             │
       │                                    │  Forward request with token │
       │                                    ├────────────────────────────→│
       │                                    │                             │
       │                                    │              ┌──────────────┴────────┐
       │                                    │              │ JwtAuthenticationFilter│
       │                                    │              │                       │
       │                                    │              │ 1. Extract token      │
       │                                    │              │ 2. Validate signature │
       │                                    │              │    (same jwt.secret)  │
       │                                    │              │ 3. Check expiration   │
       │                                    │              │ 4. Extract username   │
       │                                    │              │ 5. Extract role       │
       │                                    │              └──────────────┬────────┘
       │                                    │                             │
       │                                    │              ┌──────────────┴────────┐
       │                                    │              │  SecurityContext      │
       │                                    │              │  Set Authentication   │
       │                                    │              │  (username, role)     │
       │                                    │              └──────────────┬────────┘
       │                                    │                             │
       │                                    │              ┌──────────────┴────────┐
       │                                    │              │ @PreAuthorize Check   │
       │                                    │              │ hasAnyRole(...)       │
       │                                    │              └──────────────┬────────┘
       │                                    │                             │
       │                                    │                     ┌───────┴────────┐
       │                                    │                     │ Process Request│
       │                                    │                     │ Query Database │
       │                                    │                     └───────┬────────┘
       │                                    │                             │
       │                                    │  Response: { success: true, │
       │                                    │             data: {...} }   │
       │                                    │←────────────────────────────┤
       │                                    │                             │
       │  Response                          │                             │
       │←───────────────────────────────────┤                             │
       │                                    │                             │
   ┌───┴────┐                          ┌────┴────┐                  ┌─────┴──────┐
   │ Client │                          │ Gateway │                  │ms-visitors │
   └────────┘                          └─────────┘                  └────────────┘
```

## 3. Componentes de Seguridad

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   COMPONENTES DE SEGURIDAD JWT                          │
└─────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                         SecurityConfig                                │
│  @Configuration                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  - Disable CSRF (stateless API)                                 │ │
│  │  - Configure authorization rules                                │ │
│  │  - Set session management: STATELESS                            │ │
│  │  - Add JWT filter before UsernamePasswordAuthenticationFilter   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
                                  ↓
┌───────────────────────────────────────────────────────────────────────┐
│                   JwtAuthenticationFilter                             │
│  extends OncePerRequestFilter                                         │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  doFilterInternal():                                            │ │
│  │    1. Extract Authorization header                              │ │
│  │    2. Validate "Bearer <token>" format                          │ │
│  │    3. Extract JWT token                                         │ │
│  │    4. Use JwtService to validate                                │ │
│  │    5. Create Authentication object                              │ │
│  │    6. Set SecurityContext                                       │ │
│  │    7. Continue filter chain                                     │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
                                  ↓
┌───────────────────────────────────────────────────────────────────────┐
│                          JwtService                                   │
│  @Service                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  - extractUsername(token): String                               │ │
│  │  - extractRole(token): String                                   │ │
│  │  - extractUserId(token): Long                                   │ │
│  │  - isTokenValid(token, username): boolean                       │ │
│  │  - extractClaim(token, resolver): T                             │ │
│  │  - extractAllClaims(token): Claims                              │ │
│  │  - isTokenExpired(token): boolean                               │ │
│  │  - getSignInKey(): SecretKey                                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Uses:                                                                │
│    - jwt.secret (from application.yml)                               │
│    - io.jsonwebtoken.Jwts                                            │
│    - HMAC SHA-256 algorithm                                          │
└───────────────────────────────────────────────────────────────────────┘
                                  ↓
┌───────────────────────────────────────────────────────────────────────┐
│                JwtAuthenticationEntryPoint                            │
│  implements AuthenticationEntryPoint                                  │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  commence():                                                    │ │
│  │    - Handles authentication errors                              │ │
│  │    - Returns 401 Unauthorized                                   │ │
│  │    - JSON response: { success: false, message: "..." }          │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
```

## 4. Estructura del Token JWT

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        JWT TOKEN STRUCTURE                              │
└─────────────────────────────────────────────────────────────────────────┘

JWT Token: eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjE...
           └─────── HEADER ──────┘ └─── PAYLOAD ───┘ └── SIGNATURE ──┘

┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
│ {                                                            │
│   "alg": "HS256",        // HMAC SHA-256 algorithm          │
│   "typ": "JWT"           // Token type                      │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ PAYLOAD (Claims)                                             │
│ {                                                            │
│   "sub": "admin",                // Username (subject)      │
│   "userId": 1,                   // User ID                 │
│   "role": "ADMIN",               // User role               │
│   "firstName": "Admin",          // First name              │
│   "paternalLastName": "User",    // Paternal last name      │
│   "maternalLastName": "System",  // Maternal last name      │
│   "iat": 1698345600,            // Issued at timestamp      │
│   "exp": 1698432000             // Expiration timestamp     │
│ }                                                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SIGNATURE                                                    │
│ HMACSHA256(                                                  │
│   base64UrlEncode(header) + "." +                           │
│   base64UrlEncode(payload),                                 │
│   secret: "ynnZnUmVsXjHBgtOZQuRCiIMeQHPfqXwePYXwiYLI..."   │
│ )                                                            │
└──────────────────────────────────────────────────────────────┘

Key Points:
✅ Same secret in ms-users and ms-visitors
✅ Token expires after 24 hours (86400000 ms)
✅ Contains all necessary user information
✅ No database lookup needed for validation
```

## 5. Flujo de Autorización por Roles

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   ROLE-BASED AUTHORIZATION FLOW                         │
└─────────────────────────────────────────────────────────────────────────┘

Request arrives at endpoint
         │
         ↓
┌────────────────────────────────────┐
│ @PreAuthorize annotation checked   │
│ e.g., hasAnyRole('ADMIN','OPERATOR')│
└────────┬───────────────────────────┘
         │
         ↓
┌────────────────────────────────────┐
│ Extract role from SecurityContext  │
│ (previously set by JWT filter)     │
└────────┬───────────────────────────┘
         │
         ↓
    ┌────┴─────┐
    │Has Role? │
    └────┬─────┘
         │
    ┌────┴─────────────────┐
    │                      │
   YES                    NO
    │                      │
    ↓                      ↓
┌─────────────┐   ┌──────────────────┐
│ Allow       │   │ Deny (403)       │
│ Execute     │   │ Access Forbidden │
│ Endpoint    │   └──────────────────┘
└─────────────┘

ENDPOINTS BY ROLE:
═════════════════

┌──────────────────────────────────────────────────────────┐
│ GET /api/visitors/dni/{dni}                              │
│ Roles: ADMIN, OPERATOR, SECURITY                         │
│ ✅ All roles can view visitor by DNI                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ GET /api/visitors                                        │
│ Roles: ADMIN, OPERATOR                                   │
│ ✅ Can list all visitors                                 │
│ ❌ SECURITY cannot list all                              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ POST /api/visitors                                       │
│ Roles: ADMIN, OPERATOR                                   │
│ ✅ Can create new visitors                               │
│ ❌ SECURITY cannot create                                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ PUT /api/visitors/{id}                                   │
│ Roles: ADMIN, OPERATOR                                   │
│ ✅ Can update visitors                                   │
│ ❌ SECURITY cannot update                                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ DELETE /api/visitors/{id}                                │
│ Roles: ADMIN                                             │
│ ✅ Only ADMIN can delete                                 │
│ ❌ OPERATOR and SECURITY cannot delete                   │
└──────────────────────────────────────────────────────────┘
```

## 6. Comunicación entre Microservicios

```
┌─────────────────────────────────────────────────────────────────────────┐
│              MICROSERVICES COMMUNICATION DIAGRAM                        │
└─────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │  Eureka Server  │
                        │    :8761        │
                        └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │ Register   │   Query    │
                    │ Service    │   Service  │
                    ↓            ↓            ↓
        ┌───────────────┐  ┌───────────┐  ┌──────────────┐
        │  API Gateway  │  │ ms-users  │  │ ms-visitors  │
        │   :8000       │  │  :9000    │  │   :9001      │
        └───────┬───────┘  └─────┬─────┘  └──────┬───────┘
                │                │                │
                │                │                │
        ┌───────┴────────────────┴────────────────┴──────┐
        │         Service Discovery & Load Balancing     │
        │         (Handled by Spring Cloud)              │
        └────────────────────────────────────────────────┘

CLIENT REQUEST FLOW:
═══════════════════

1. Client → API Gateway
   http://localhost:8000/api/visitors/...

2. Gateway queries Eureka
   "Where is ms-visitors?"

3. Eureka responds
   "ms-visitors is at localhost:9001"

4. Gateway forwards request
   http://localhost:9001/api/visitors/...

5. ms-visitors processes and responds

6. Gateway returns response to client
```

¡Listo! 🎉
