# Fin.app – Backend NestJS

Backend REST API para el dashboard de finanzas personales **Fin.app**.  
Construido con **NestJS + TypeORM + SQLite** (sin configuración extra de DB).

---

## Estructura del proyecto

```
finapp-backend/
├── src/
│   ├── main.ts                        # Punto de entrada (CORS, Swagger, ValidationPipe)
│   ├── app.module.ts                  # Módulo raíz (TypeORM SQLite)
│   │
│   ├── transactions/                  # Módulo de transacciones
│   │   ├── transaction.entity.ts      # Entidad TypeORM
│   │   ├── transactions.service.ts    # Lógica de negocio + filtros + paginación
│   │   ├── transactions.controller.ts # Rutas REST
│   │   ├── transactions.module.ts
│   │   └── dto/
│   │       ├── create-transaction.dto.ts
│   │       ├── update-transaction.dto.ts
│   │       └── query-transaction.dto.ts
│   │
│   ├── categories/                    # Módulo de categorías
│   │   ├── category.entity.ts
│   │   ├── categories.service.ts      # Con seed de categorías por defecto
│   │   ├── categories.controller.ts
│   │   ├── categories.module.ts
│   │   └── dto/
│   │       └── create-category.dto.ts
│   │
│   └── summary/                       # Módulo de resumen para el dashboard
│       ├── summary.service.ts         # Calcula income/expense/balance + breakdown
│       ├── summary.controller.ts
│       └── summary.module.ts
│
├── index.html                         # Frontend actualizado (apunta a este backend)
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo (hot-reload)
npm run start:dev

# 3. (Opcional) Build de producción
npm run build
npm run start:prod
```

El servidor arranca en **http://localhost:3000**  
La documentación Swagger queda en **http://localhost:3000/api**

---

## Endpoints

### Transactions – `/transactions`

| Método | Ruta                  | Descripción                              |
|--------|-----------------------|------------------------------------------|
| GET    | `/transactions`       | Listar (paginado, filtros opcionales)    |
| GET    | `/transactions/:id`   | Obtener una transacción                  |
| POST   | `/transactions`       | Crear transacción                        |
| PATCH  | `/transactions/:id`   | Actualizar parcialmente                  |
| DELETE | `/transactions/:id`   | Eliminar                                 |

**Query params para GET `/transactions`:**

| Param        | Tipo   | Descripción                          |
|--------------|--------|--------------------------------------|
| `type`       | string | `income` o `expense`                 |
| `categoryId` | number | Filtrar por categoría                |
| `from`       | date   | Fecha inicio `YYYY-MM-DD`            |
| `to`         | date   | Fecha fin `YYYY-MM-DD`               |
| `page`       | number | Número de página (default: 1)        |
| `limit`      | number | Resultados por página (default: 20)  |

**Body para POST/PATCH:**

```json
{
  "concept": "Pago de arriendo",
  "amount": 1500000,
  "type": "expense",
  "date": "2024-03-15",
  "categoryId": 1
}
```

---

### Categories – `/categories`

| Método | Ruta               | Descripción           |
|--------|--------------------|-----------------------|
| GET    | `/categories`      | Listar categorías     |
| GET    | `/categories/:id`  | Obtener una           |
| POST   | `/categories`      | Crear nueva           |
| DELETE | `/categories/:id`  | Eliminar              |

**Categorías predeterminadas** (se crean automáticamente al iniciar):

🏠 Hogar · 🏥 Salud · 🎮 Entretenimiento · 🍔 Alimentación  
🚌 Transporte · 📚 Educación · 👗 Ropa · 📦 Otros

---

### Summary – `/summary`

| Método | Ruta       | Descripción                                |
|--------|------------|--------------------------------------------|
| GET    | `/summary` | Resumen del dashboard (balance + breakdown)|

**Query params opcionales:** `from`, `to` (mismo formato de fecha)

**Respuesta de ejemplo:**

```json
{
  "income": 5000000,
  "expense": 2300000,
  "balance": 2700000,
  "transactionCount": 14,
  "categoryBreakdown": [
    {
      "categoryId": 1,
      "categoryName": "Hogar",
      "categoryEmoji": "🏠",
      "total": 1500000
    }
  ]
}
```

---

## Base de datos

Usa **SQLite** — el archivo `finapp.db` se crea automáticamente al iniciar.  
Para usar PostgreSQL o MySQL en producción, cambia el bloque `TypeOrmModule.forRoot` en `app.module.ts`:

```ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Transaction, Category],
  synchronize: false, // usar migraciones en producción
}),
```

---

## Conectar el frontend

El archivo `index.html` incluido ya apunta al backend.  
Solo abre el HTML en tu navegador con el backend corriendo.

Si el backend corre en otro puerto o dominio, cambia esta línea en el HTML:

```js
const API = 'http://localhost:3000';
```
