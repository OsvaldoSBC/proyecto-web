from rest_framework import viewsets
from .models import Organizacion, Categoria, Equipo, Piloto, Noticia
from .serializers import OrganizacionSerializer, CategoriaSerializer, EquipoSerializer, PilotoSerializer, NoticiaSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import RegisterSerializer
from rest_framework import generics
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class OrganizacionViewSet(viewsets.ModelViewSet):
    queryset = Organizacion.objects.all()
    serializer_class = OrganizacionSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class EquipoViewSet(viewsets.ModelViewSet):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer

class PilotoViewSet(viewsets.ModelViewSet):
    queryset = Piloto.objects.all()
    serializer_class = PilotoSerializer

class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all().order_by('-fecha') 
    serializer_class = NoticiaSerializer

# Vista para registrar usuarios
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Cualquiera puede registrarse
    serializer_class = RegisterSerializer

class SuscribirseView(APIView):
    # Solo pueden entrar usuarios logueados
    permission_classes = [IsAuthenticated]

    def post(self, request, categoria_id):
        # 1. Buscamos la categoría
        categoria = get_object_or_404(Categoria, id=categoria_id)
        # 2. Buscamos el perfil del usuario que está haciendo la petición
        perfil = request.user.perfil

        # 3. Lógica de Switch (Toggle)
        if perfil.suscripciones.filter(id=categoria.id).exists():
            perfil.suscripciones.remove(categoria)
            mensaje = "Desuscrito"
            estado = False
        else:
            perfil.suscripciones.add(categoria)
            mensaje = "Suscrito"
            estado = True

        return Response({'mensaje': mensaje, 'suscrito': estado}, status=status.HTTP_200_OK)

class MiPerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Devuelve una lista de IDs de las categorías que sigo. Ej: [1, 5, 8]
        suscripciones_ids = request.user.perfil.suscripciones.values_list('id', flat=True)
        return Response({'suscripciones': list(suscripciones_ids)})