# Los Antojitos de Misha - Etapa 1

Sistema de pedidos en línea para fonda de antojitos mexicanos.

## Características de la Etapa 1

### Base de Datos
- Base de datos completa en Supabase con todas las tablas necesarias
- Categorías de productos (Tacos, Quesadillas, Sopes, Bebidas)
- Productos con precios base
- Ingredientes con control de inventario
- Recetas (BOM) para relacionar productos con ingredientes
- Grupos de opciones y opciones de personalización
- Sistema de usuarios con roles (cliente/admin)
- Row Level Security (RLS) configurado en todas las tablas

### Autenticación
- Registro de nuevos usuarios
- Inicio de sesión con email y contraseña
- Gestión de perfiles de usuario
- Roles: cliente y admin
- Protección de rutas según rol

### Catálogo de Productos
- Vista de categorías con diseño atractivo
- Listado de productos por categoría
- Modal de detalle de producto con:
  - Opciones de personalización (tortilla, salsas, extras)
  - Control de cantidad
  - Cálculo de precio total
  - Validación de opciones requeridas

### Panel de Administración (Solo Admin)
- Vista de productos con listado completo
- Vista de categorías registradas
- Vista de ingredientes con control de stock
- Indicadores de stock bajo

### Datos de Prueba
La base de datos incluye datos de ejemplo:
- 4 categorías (Tacos, Quesadillas, Sopes, Bebidas)
- 8 productos
- 11 ingredientes
- 3 grupos de opciones con sus respectivas opciones

## Estructura del Proyecto

```
src/
├── components/
│   ├── Auth/
│   │   ├── AuthPage.tsx       # Página principal de autenticación
│   │   ├── LoginForm.tsx      # Formulario de inicio de sesión
│   │   └── RegisterForm.tsx   # Formulario de registro
│   ├── Catalog/
│   │   ├── CategoryCard.tsx   # Tarjeta de categoría
│   │   ├── ProductCard.tsx    # Tarjeta de producto
│   │   └── ProductModal.tsx   # Modal de detalle de producto
│   └── Layout/
│       └── Header.tsx          # Header con navegación
├── contexts/
│   └── AuthContext.tsx         # Contexto de autenticación
├── lib/
│   └── supabase.ts            # Cliente de Supabase
├── pages/
│   ├── AdminPage.tsx          # Panel de administración
│   └── CatalogPage.tsx        # Catálogo de productos
├── App.tsx                     # Componente principal
└── main.tsx                    # Punto de entrada

supabase/
└── migrations/
    └── create_initial_schema.sql  # Schema inicial de la base de datos
```

## Cómo Usar la Aplicación

### Registro de Usuario
1. En la página de inicio, haz clic en "¿No tienes cuenta? Regístrate"
2. Completa el formulario con tu información
3. Tu cuenta se creará con el rol de "cliente" por defecto

### Navegar el Catálogo (Cliente)
1. Después de iniciar sesión, verás las categorías disponibles
2. Haz clic en una categoría para ver sus productos
3. Haz clic en un producto para ver opciones de personalización
4. Selecciona tus opciones preferidas (tortilla, salsas, extras)
5. Ajusta la cantidad y agrega al carrito

### Panel de Administración
1. Inicia sesión con una cuenta de admin
2. Verás el panel de administración automáticamente
3. Puedes ver:
   - Todos los productos registrados
   - Categorías activas e inactivas
   - Inventario de ingredientes con alertas de stock bajo

### Crear Usuario Admin
Para crear un usuario administrador, ejecuta este SQL en Supabase:

```sql
-- Primero registra el usuario normalmente en la aplicación
-- Luego ejecuta esto reemplazando el email con el correo del usuario:
UPDATE users_profile
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

## Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Validación**: HTML5 + React controlled components

## Variables de Entorno

Las variables de entorno ya están configuradas en el archivo `.env`:
- `VITE_SUPABASE_URL`: URL del proyecto Supabase
- `VITE_SUPABASE_ANON_KEY`: Clave pública de Supabase

## Próximas Etapas

### Etapa 2 (Pendiente)
- Carrito de compras funcional con persistencia
- Sistema de órdenes completo
- Flujo de checkout con modalidades (recoger, mesa, domicilio)
- Cálculo de envío para domicilio
- Estados de orden (creada, pagada, en preparación, lista, entregada)

### Etapa 3 (Pendiente)
- Vista de cocina (KDS) con tickets
- Descuento automático de inventario al preparar órdenes
- Historial de órdenes del cliente
- Menú del día y promociones
- Reportes para administrador
- Sistema de notificaciones

## Comandos Disponibles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Verificar tipos de TypeScript
npm run typecheck

# Linter
npm run lint
```

## Notas Importantes

1. **Seguridad**: Todas las tablas tienen Row Level Security (RLS) habilitado
2. **Datos de Prueba**: La base de datos ya incluye categorías, productos e ingredientes de ejemplo
3. **Roles**: Los usuarios se crean como "cliente" por defecto
4. **Admin**: Para probar funcionalidad admin, necesitas actualizar manualmente el rol en la base de datos
5. **Carrito**: La funcionalidad de carrito está simulada en esta etapa (muestra alerta)

## Esquema de Base de Datos

### Tablas Principales
- `users_profile`: Perfiles de usuario con roles
- `categories`: Categorías de productos
- `products`: Productos con precios
- `ingredients`: Ingredientes con stock
- `recipes`: Relación productos-ingredientes (BOM)
- `option_groups`: Grupos de opciones de personalización
- `options`: Opciones individuales con precios adicionales
- `product_option_groups`: Relación productos-grupos de opciones

### Relaciones Clave
- Un producto pertenece a una categoría
- Un producto tiene muchos ingredientes (a través de recetas)
- Un producto puede tener varios grupos de opciones
- Un grupo de opciones tiene muchas opciones
- Un usuario tiene un perfil con rol

## Soporte

Para problemas o preguntas sobre esta etapa del proyecto, contacta al equipo de desarrollo.
