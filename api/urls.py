from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizacionViewSet, 
    CategoriaViewSet, 
    EquipoViewSet, 
    PilotoViewSet, 
    NoticiaViewSet
)

# Creamos el Router (el encargado de crear las URLs automáticas)
router = DefaultRouter()
router.register(r'organizaciones', OrganizacionViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'equipos', EquipoViewSet)
router.register(r'pilotos', PilotoViewSet)
router.register(r'noticias', NoticiaViewSet)

urlpatterns = [
    # Esto incluye todas las rutas generadas por el router (ej: /api/equipos/)
    path('', include(router.urls)),
]