```markdown
# 🏦 Ejercicio Tecnico Sistema de Productos Financieros

Aplicación Angular 19 para gestión de productos financieros con CRUD completo, validaciones robustas y diseño responsive.

## Autor
https://github.com/JMVillota

## 🚀 Características

- ✅ **CRUD Completo** - Crear, editar, eliminar productos
- ✅ **Búsqueda en Tiempo Real** - Filtrado instantáneo
- ✅ **Validaciones Robustas** - Formularios con feedback visual
- ✅ **Responsive Design** - Optimizado para móviles
- ✅ **Skeleton Loading** - Estados de carga profesionales
- ✅ **Pruebas Unitarias** - Cobertura 70%+ con Jest

## 🛠️ Stack Tecnológico

- **Angular 19** + TypeScript 5.7
- **Jest** para testing
- **SCSS** sin frameworks externos
- **Angular Signals** para estado reactivo
- **Standalone Components**

## ⚡ Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/JMVillota/Ejercicio_Tecnico_TCS
cd prueba-tecnica-tsc

# Instalar dependencias
npm install

# Configurar backend (puerto 3002)
cd repo-interview-main
npm install && npm run start:dev
## Configuración de CORS en el Backend
Active CORS en el backend para poder recibir las apis en mi app

# Ejecutar aplicación (puerto 4200)
ng serve
```

## 🧪 Testing

```bash
npm test              # Pruebas unitarias
npm run test:coverage # Con cobertura
npm run test:ci      # Modo CI/CD
```

## 📋 Funcionalidades Implementadas

| Funcionalidad | Estado | Descripción |
|---------------|--------|-------------|
| F1 - Listado | ✅ | Tabla responsive con skeleton loading |
| F2 - Búsqueda | ✅ | Filtrado en tiempo real |
| F3 - Paginación | ✅ | Control 5/10/20 registros |
| F4 - Crear | ✅ | Formulario con validaciones completas |
| F5 - Editar | ✅ | Menú contextual + formulario prellenado |
| F6 - Eliminar | ✅ | Modal de confirmación |

## 🎯 Validaciones de Formulario

- **ID**: 3-10 caracteres, único
- **Nombre**: 5-100 caracteres
- **Descripción**: 10-200 caracteres
- **Logo**: URL válida
- **Fecha Liberación**: >= fecha actual
- **Fecha Revisión**: Automática (+1 año)

## 🏗️ Arquitectura

```
src/app/
├── layout/          # Sidebar + Topbar
├── pages/
│   ├── crud/        # Listado productos
│   ├── product-form/ # Crear/Editar
│   ├── services/    # HTTP services
│   └── models/      # TypeScript interfaces
└── shared/          # Componentes reutilizables
```

## 🎨 Principios Aplicados

### Clean Code + SOLID
- Funciones pequeñas y enfocadas
- Responsabilidad única por componente
- Separación de concerns
- Código autodocumentado

### Angular Best Practices
- OnPush change detection
- Standalone components
- Reactive forms con validaciones
- Lazy loading
- Error handling centralizado

## 📱 Responsive Features

- **Móvil**: 50% responsive
- **Desktop**: Experiencia completa

## 🔧 API Endpoints

```
GET    /bp/products              # Listar
POST   /bp/products              # Crear
PUT    /bp/products/:id          # Actualizar
DELETE /bp/products/:id          # Eliminar
GET    /bp/products/verification/:id # Verificar ID
```

## ⚡ Optimizaciones

- Angular Signals para reactividad
- TrackBy functions en listas
- Debounced search
- Image lazy loading
- Skeleton states

## 🔒 Accesibilidad

- ARIA labels completos
- Navegación por teclado
- Soporte alto contraste
- Compatible screen readers

## 📊 Cobertura de Tests

- **Líneas**: 70%+
- **Funciones**: 70%+
- **Ramas**: 70%+
- **Componentes**: 100% testeados