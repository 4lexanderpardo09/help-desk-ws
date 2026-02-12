# Help Desk WebSocket Service

Servicio WebSocket independiente para notificaciones en tiempo real del sistema Help Desk.

## 📋 Descripción

Este servicio maneja exclusivamente las conexiones WebSocket para notificaciones push en tiempo real. Está separado del API REST principal para permitir:

- Despliegue en infraestructura optimizada para WebSocket (ECS Fargate + ALB)
- Escalabilidad independiente basada en conexiones concurrentes
- Actualizaciones sin afectar conexiones activas

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 20+
- pnpm 8+

### Instalación

```bash
# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env y configurar JWT_SECRET (debe ser el mismo que help-desk-back)
```

### Desarrollo

```bash
# Modo desarrollo con hot-reload
pnpm run start:dev
```

El servicio estará disponible en `http://localhost:3001`

### Producción

```bash
# Build
pnpm run build

# Ejecutar
pnpm run start:prod
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servicio | `3001` |
| `JWT_SECRET` | Secreto para validar JWT (⚠️ **debe ser el mismo que help-desk-back**) | - |
| `CORS_ORIGIN` | Origen permitido para CORS | `*` |
| `NODE_ENV` | Entorno de ejecución | `development` |

> [!WARNING]
> El `JWT_SECRET` **DEBE** ser exactamente el mismo que usa el API REST (`help-desk-back`) para que los tokens sean compatibles entre servicios.

## 📡 Uso del WebSocket

### Conexión desde el Frontend

```typescript
import { io } from 'socket.io-client';

const token = localStorage.getItem('token');
const socket = io('http://localhost:3001/notifications', {
    auth: { token },
    transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
    console.log('Connected to WebSocket');
});

socket.on('new_notification', (data) => {
    console.log('New notification:', data);
});
```

### Eventos Disponibles

- `new_notification` - Nueva notificación para el usuario
- `ticket_assigned` - Ticket asignado al usuario
- `ticket_updated` - Ticket actualizado
- `ticket_overdue` - Ticket vencido

## 🐳 Docker

### Build

```bash
docker build -t help-desk-ws:latest .
```

### Run

```bash
docker run -p 3001:3001 \
  -e JWT_SECRET=your-secret-here \
  -e PORT=3001 \
  -e CORS_ORIGIN=https://your-frontend.com \
  help-desk-ws:latest
```

## ☁️ Despliegue en AWS ECS Fargate

### 1. Crear Repositorio ECR

```bash
aws ecr create-repository --repository-name help-desk-ws
```

### 2. Build y Push de la Imagen

```bash
# Login a ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build
docker build -t help-desk-ws:latest .

# Tag
docker tag help-desk-ws:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/help-desk-ws:latest

# Push
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/help-desk-ws:latest
```

### 3. Crear Task Definition

Crear una Task Definition en ECS con:
- Container Port: `3001`
- Environment Variables: `JWT_SECRET`, `CORS_ORIGIN`
- Health Check: TCP en puerto 3001

### 4. Crear Service con ALB

- Application Load Balancer con soporte para WebSocket
- Target Group con protocolo HTTP
- Sticky sessions habilitadas

## 🔗 Integración con API REST

El API REST puede emitir notificaciones al servicio WebSocket mediante:

### Opción 1: HTTP Endpoint (Futuro)

```typescript
// En help-desk-back
await axios.post('http://ws-service/emit', {
    userId: 123,
    event: 'new_notification',
    data: { message: 'Ticket assigned' }
});
```

### Opción 2: Message Queue (Recomendado para producción)

```
API REST → SNS Topic → WebSocket Service (subscriber)
```

## 📁 Estructura del Proyecto

```
src/
├── auth/
│   ├── interfaces/
│   │   └── jwt-payload.interface.ts  # Interfaz compartida con API REST
│   └── jwt.strategy.ts                # Estrategia de autenticación JWT
├── notifications/
│   ├── notifications.gateway.ts       # Gateway WebSocket principal
│   └── notifications.module.ts        # Módulo de notificaciones
├── app.module.ts                      # Módulo raíz
└── main.ts                            # Bootstrap de la aplicación
```

## 🧪 Testing

### Verificar Conexión

```bash
# Usando wscat
npm install -g wscat
wscat -c "ws://localhost:3001/notifications?token=YOUR_JWT_TOKEN"
```

### Logs

Los logs mostrarán:
- Conexiones exitosas con User ID
- Desconexiones
- Errores de autenticación

```
[NotificationsGateway] Client connected: abc123, User ID: 42, Room: user_42
[NotificationsGateway] Client disconnected: abc123
```

## 🔒 Seguridad

- ✅ Autenticación JWT obligatoria
- ✅ Validación de firma del token
- ✅ Rooms privadas por usuario
- ⚠️ Configurar `CORS_ORIGIN` en producción (no usar `*`)

## 📝 Notas

- Este servicio **NO** accede a la base de datos
- Solo valida JWT y maneja conexiones WebSocket
- La lógica de negocio permanece en `help-desk-back`

## 🤝 Contribución

Este servicio es parte del ecosistema Help Desk:
- `help-desk-back` - API REST principal
- `help-desk-ws` - Servicio WebSocket (este proyecto)
- `help-desk-front` - Frontend React

## 📄 Licencia

UNLICENSED - Uso interno
# help-desk-ws
