# Configuración de Vercel KV

Esta API ahora usa Vercel KV (Redis) para persistir datos entre requests. Los datos son editables y se mantienen hasta que llames a `/api/init` para resetearlos.

## Pasos para configurar Vercel KV

### 1. Crear el KV Database en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/unailecuez/novacare-mock-api
2. Click en **Storage** en el menú superior
3. Click en **Create Database**
4. Selecciona **KV (Redis)**
5. Nombre sugerido: `novacare-kv` o `novacare-data`
6. Region: Elige la más cercana (por ejemplo: `us-east-1`)
7. Click **Create**

### 2. Conectar el KV Database al proyecto

1. Después de crear el database, verás una opción **Connect to Project**
2. Selecciona el proyecto `novacare-mock-api`
3. Environment: Selecciona **Production**, **Preview**, y **Development**
4. Click **Connect**

Vercel automáticamente agregará las variables de entorno necesarias:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

### 3. Re-deploy

Una vez conectado el KV:
1. Ve a **Deployments**
2. Click en el último deployment
3. Click en los tres puntos `...` → **Redeploy**

O simplemente haz un nuevo push a GitHub y Vercel automáticamente desplegará con las nuevas variables de entorno.

### 4. Inicializar los datos

Una vez desplegado, haz un request a:

```bash
curl -X POST https://novacare-mock-api.vercel.app/api/init
```

O simplemente visita en el navegador:
```
https://novacare-mock-api.vercel.app/api/init
```

Esto cargará los datos iniciales (3 pacientes, 6 appointments, 10 slots disponibles).

## Comportamiento de los datos

### Datos persistentes
- Cuando creas un appointment (POST), se guarda en KV
- Cuando modificas un appointment (PUT), se actualiza en KV
- Cuando cancelas un appointment (DELETE), se marca como "cancelled" en KV
- Cuando reservas un slot, ese slot se elimina de los disponibles

### Reset de datos
Para volver al estado inicial en cualquier momento:
```bash
POST /api/init
```

Esto:
- Restaura los 3 pacientes originales
- Restaura los 6 appointments originales
- Restaura los 10 slots disponibles originales
- Borra cualquier appointment/slot creado durante las pruebas

## Desarrollo local (opcional)

Si quieres desarrollar localmente con KV:

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Link el proyecto:
```bash
vercel link
```

3. Pull las variables de entorno:
```bash
vercel env pull .env.local
```

4. Corre localmente:
```bash
vercel dev
```

## Verificación

Después de configurar, prueba estos endpoints:

```bash
# 1. Inicializar datos
curl -X POST https://novacare-mock-api.vercel.app/api/init

# 2. Ver appointments
curl https://novacare-mock-api.vercel.app/api/appointments

# 3. Crear nuevo appointment
curl -X POST https://novacare-mock-api.vercel.app/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"patient_id":"PAT-001","slot_id":"SLOT-001","appointment_type":"Checkup"}'

# 4. Ver appointments nuevamente (debería incluir el nuevo)
curl https://novacare-mock-api.vercel.app/api/appointments

# 5. Reset
curl -X POST https://novacare-mock-api.vercel.app/api/init
```

## Notas importantes

- **Gratis hasta 256MB** - Más que suficiente para este mock API
- **Los datos persisten** entre deploys (no se pierden)
- **Latencia baja** - Redis es muy rápido (~1-5ms)
- **Automatic initialization** - Si la KV está vacía, se auto-inicializa en el primer request
