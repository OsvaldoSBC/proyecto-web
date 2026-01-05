# backend/api/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, 
    SuscribirseView, 
    MiPerfilView, 
    RaceSuiteDashboardView, 
    RaceSuitePilotoDetailView,
    get_equipos,
    get_categorias, get_categoria_detail, get_noticias, get_noticia_detail 
)

urlpatterns = [
    # Autenticación
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Usuario y Dashboard (Race Suite)
    path('mi-perfil/', MiPerfilView.as_view(), name='mi_perfil'),
    path('race-suite-dashboard/', RaceSuiteDashboardView.as_view(), name='race-suite-dashboard'), 
    path('race-suite-piloto/<int:pk>/', RaceSuitePilotoDetailView.as_view(), name='race-suite-piloto'),
    
    # Contenido Público
    path('equipos/', get_equipos, name='equipos'),
    path('categorias/', get_categorias, name='categorias'),
    path('categorias/<int:pk>/', get_categoria_detail, name='categoria_detail'),
    path('noticias/', get_noticias, name='noticias'),
    path('noticias/<int:pk>/', get_noticia_detail, name='noticia_detail'),
    path('suscribirse/<int:categoria_id>/', SuscribirseView.as_view(), name='suscribirse'),
]