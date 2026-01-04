"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from api import views
from api.views import SuscribirseView, RegisterView, MiPerfilView 

# Router automático 
from django.contrib import admin
from django.urls import path, include
from api.views import SuscribirseView, RegisterView # Importamos las vistas nuevas
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # 1. Conectamos el archivo que acabamos de crear (api/urls.py)
    # Esto manejará /api/equipos, /api/noticias, etc.
    path('api/', include('api.urls')), 
    path('api/mi-perfil/', MiPerfilView.as_view(), name='mi_perfil'),
    
    # 2. Rutas de Autenticación (Login, Registro, Tokens)
    path('api/register/', RegisterView.as_view(), name='auth_register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 3. Ruta de Suscripción
    path('api/suscribirse/<int:categoria_id>/', SuscribirseView.as_view(), name='suscribirse'),
]