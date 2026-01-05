# 🏎️ Racing Hub

Plataforma integral para la gestión y visualización de campeonatos de automovilismo. Integra noticias, resultados en tiempo real, perfiles de pilotos y un dashboard administrativo ("Race Suite") para jefes de equipo.

## 📋 Características

* **Gestión de Contenido:** Noticias, resultados oficiales y galerías de video.
* **Race Suite:** Dashboard protegido para managers de equipo (gestión de pilotos y branding).
* **Suscripciones:** Sistema de seguimiento personalizado de categorías para usuarios.
* **Arquitectura Híbrida:** Django sirve la API REST y la aplicación React compilada.

## 🛠️ Tecnologías

* **Backend:** Python 3.10+, Django 5, Django REST Framework, SimpleJWT.
* **Frontend:** React (Vite), Tailwind CSS, Lucide React, Axios.
* **Base de Datos:** SQLite (Por defecto).
* **Gestión de Entornos:** Conda.

## 🚀 Guía de Instalación Paso a Paso

Sigue estas instrucciones al pie de la letra para ejecutar el proyecto en tu máquina local.

## 0. Prerrequisitos

1.  **Git**: [Descargar](https://git-scm.com/downloads).
2.  **Miniconda (o Anaconda)**: [Descargar](https://docs.conda.io/en/latest/miniconda.html).
3.  **Node.js (LTS)**: [Descargar](https://nodejs.org/).

---

### 1. Clonar el Repositorio

Abre tu terminal Anaconda Prompt y ejecuta:

```bash
git clone <URL_DEL_REPOSITORIO>
cd Pagina
```

### 2. Configuración del Backend (Django)

Usaremos Conda para crear un entorno aislado y seguro.

```bash
# 1. Crear el entorno (asegúrate de estar en la carpeta raíz 'Pagina')
conda env create -f environment.yml

# 2. Activar el entorno
conda activate web

# 3. Instalar las dependencias del proyecto
pip install -r requirements.txt
```

**Configuración de Variables de Entorno (.env):**

1.  En la carpeta raíz, duplica el archivo `.env.example` y renómbralo a `.env`.
2.  Abre el nuevo archivo `.env` y asegúrate de que `DEBUG=True` para desarrollo.

**Preparar la Base de Datos:**

```bash
# 1. Crear las tablas en la base de datos
python manage.py migrate

# 2. Crear un usuario administrador (sigue las instrucciones en pantalla)
python manage.py createsuperuser

# 3. (Opcional) Cargar datos iniciales
python manage.py loaddata datos_iniciales.json
```

### 2. Configuración del Frontend

```bash
cd frontend
npm install

# Opción A: Compilar para producción en frontend (Integración con Django)
npm run build
# En PAGINA
python manage.py runserver


# Opción B: Modo desarrollo (Hot Reload)
npm run dev
# En PAGINA
python manage.py runserver
