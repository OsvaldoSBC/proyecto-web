### Paso 1: Configurar el Backend (Servidor)

**Opción A: Si usas Anaconda / Miniconda (RECOMENDADO ⭐)**
Es la forma más rápida. Ejecuta esto y se instalará todo automáticamente:
```bash
conda env create -f environment.yml
conda activate web

```

**Opción B: Si usas Python normal (Pip)**

1. Crear entorno virtual: `python -m venv venv`
2. Activar entorno.
3. Instalar: `pip install -r requirements.txt`

---

*Una vez instalado (con Opción A o B), prepara la base de datos:*

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

```

```

---
