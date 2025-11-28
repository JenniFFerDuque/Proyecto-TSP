# SurveyFlow - Sistema de Gestión de Encuestas

## 📋 Descripción del Proyecto

**SurveyFlow** es una aplicación web moderna diseñada para la creación, gestión y análisis de encuestas empresariales. Permite a las organizaciones recopilar feedback de clientes y empleados de manera eficiente, con capacidades avanzadas de reporting y análisis de datos.

### 🎯 Características Principales

- ✅ **Gestión Multiempresa** - Aislamiento completo de datos entre organizaciones
- ✅ **Creación Intuitiva de Encuestas** - Editor drag & drop con múltiples tipos de preguntas
- ✅ **Distribución Flexible** - Enlaces web, códigos QR y múltiples canales
- ✅ **Reportes Avanzados** - Exportación PDF/Excel con gráficos interactivos
- ✅ **Interfaz Responsive** - Experiencia optimizada para desktop y móvil
- ✅ **Control de Accesos** - Roles diferenciados (Admin, Creador, Analista)


## 🛠️ Tecnologías Utilizadas

### Backend
- **Framework:** Spring Boot 3.x
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT + Spring Security
- **API:** RESTful APIs
- **Cache:** Redis

### Frontend
- **Framework:** React 18 + TypeScript
- **Estilos:** Tailwind CSS
- **Estado:** Redux Toolkit
- **Grágicos:** Chart.js
- **Build:** Vite


## 📥 Instalación Rápida

### Prerrequisitos
- Java 17+
- Node.js 18+
- PostgreSQL 14+


### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/surveyflow.git
cd surveyflow
```
2. **Ejecutar**
```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend (nueva terminal)
cd frontend
npm install
npm run dev
```

## Arquitectura del Sistema
```bash
SurveyFlow/
├── 📁 backend/                 # API Spring Boot
│   ├── 📁 src/main/java/
│   │   ├── 📁 controllers/     # Controladores REST
│   │   ├── 📁 services/        # Lógica de negocio
│   │   ├── 📁 repositories/    # Acceso a datos
│   │   ├── 📁 entities/        # Entidades JPA
│   │   └── 📁 config/          # Configuraciones
│   └── 📁 src/main/resources/
│       └── application.yml     # Configuración
├── 📁 frontend/                # Aplicación React
│   ├── 📁 src/
│   │   ├── 📁 components/      # Componentes React
│   │   ├── 📁 pages/           # Páginas principales
│   │   ├── 📁 store/           # Estado Redux
│   │   ├── 📁 services/        # Servicios API
│   │   └── 📁 utils/           # Utilidades
│   └── package.json
├── 📁 docs/                    # Documentación
├── 📁 scripts/                 # Scripts de despliegue
└── docker-compose.yml         # Orquestación Docker
```

## 🤝 Contribución
¡Agradecemos las contribuciones! Por favor:

```bash
1. Fork el proyecto

2. Crea una rama para tu feature (git checkout -b feature/AmazingFeature)

3. Commit tus cambios (git commit -m 'Add some AmazingFeature')

4. Push a la rama (git push origin feature/AmazingFeature)

5. Abre un Pull Request

Guía de Estilo
Sigue las convenciones de commits convencionales

Mantén la cobertura de tests por encima del 70%

Documenta nuevas features en el README

Usa English para nombres de variables y comentarios
```


## 👨‍💻 Equipo de Desarrollo
Team SurveyFlow - Desarrollo de Software en Equipo

- Adolfo Jimenez Ortiz - Team Leader

- Jenniffer Tatiana Duque Zamora - Quality Process Manager

- Daniel Alejandro Medina Hernández - Development Manager

- Jhoan Sebastián Ramírez Vargas - Support Manager

- Daniel Felipe Toro Solarte - Planning Manager
