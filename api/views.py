from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
# Modelos
from .models import Noticia, Categoria, Piloto, Equipo

# Serializers
from .serializers import (
    RegisterSerializer, 
    NoticiaSerializer, 
    CategoriaSerializer,
    EquipoSerializer 
)

# --- Vistas Públicas de Contenido ---
@api_view(['GET'])
@permission_classes([AllowAny])
def get_categorias(request):
    categorias = Categoria.objects.all()
    serializer = CategoriaSerializer(categorias, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_categoria_detail(request, pk):
    try:
        categoria = Categoria.objects.get(pk=pk)
    except Categoria.DoesNotExist:
        return Response(status=404)
    serializer = CategoriaSerializer(categoria)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_noticias(request):
    noticias = Noticia.objects.all().order_by('-fecha')
    serializer = NoticiaSerializer(noticias, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_noticia_detail(request, pk):
    try:
        noticia = Noticia.objects.get(pk=pk)
    except Noticia.DoesNotExist:
        return Response(status=404)
    serializer = NoticiaSerializer(noticia)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_equipos(request):
    equipos = Equipo.objects.all()
    serializer = EquipoSerializer(equipos, many=True)
    return Response(serializer.data)


# --- Gestión de Usuarios ---
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# Vista para obtener y gestionar el perfil del usuario autenticado
class MiPerfilView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        suscripciones = user.perfil.suscripciones.values_list('id', flat=True)
        return Response({
            'username': user.username,
            'email': user.email,
            'suscripciones': list(suscripciones),
            'fecha_unido': user.date_joined
        })
    def delete(self, request):
        request.user.delete()
        return Response(status=204)

# Vista para alternar suscripción a una categoría
class SuscribirseView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, categoria_id):
        perfil = request.user.perfil
        try:
            cat = Categoria.objects.get(id=categoria_id)
            if cat in perfil.suscripciones.all():
                perfil.suscripciones.remove(cat)
                return Response({'suscrito': False})
            else:
                perfil.suscripciones.add(cat)
                return Response({'suscrito': True})
        except Categoria.DoesNotExist:
            return Response(status=404)


# --- Dashboard para Jefes de Equipo (Race Suite) ---
class RaceSuiteDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    # Obtiene datos del equipo administrado por el usuario
    def get(self, request):
        if not hasattr(request.user, 'perfil') or not request.user.perfil.equipo_administrado:
            return Response({'error': 'No eres manager'}, status=403)
        
        equipo = request.user.perfil.equipo_administrado
        
        data_equipo = {
            'id': equipo.id,
            'nombre': equipo.nombre,
            'logo_url': equipo.logo_url,
            'web_oficial': equipo.web_oficial,
            'twitter': equipo.twitter,
        }
        
        pilotos = Piloto.objects.filter(equipo=equipo).values('id', 'nombre', 'foto_url', 'nacionalidad')
        
        return Response({
            'equipo': data_equipo,
            'pilotos': list(pilotos)
        })

    # Actualiza información del equipo
    def put(self, request):
        if not request.user.perfil.equipo_administrado: return Response(status=403)
        
        equipo = request.user.perfil.equipo_administrado
        data = request.data
        
        if 'web_oficial' in data: equipo.web_oficial = data['web_oficial']
        if 'twitter' in data: equipo.twitter = data['twitter']
        equipo.save()
        
        return Response({'mensaje': 'Guardado'})

    # Crea un nuevo piloto en el equipo
    def post(self, request):
        if not request.user.perfil.equipo_administrado: return Response(status=403)
        
        equipo = request.user.perfil.equipo_administrado
        data = request.data
        
        Piloto.objects.create(
            nombre=data['nombre'],
            nacionalidad=data.get('nacionalidad', 'INT'),
            foto_url=data.get('foto_url', ''),
            equipo=equipo,
            categoria=equipo.categoria
        )
        return Response({'mensaje': 'Piloto Creado'})


# Gestión individual de pilotos para el Dashboard
class RaceSuitePilotoDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        if not request.user.perfil.equipo_administrado: return Response(status=403)
        equipo_del_jefe = request.user.perfil.equipo_administrado
        
        piloto = get_object_or_404(Piloto, pk=pk, equipo=equipo_del_jefe)
        
        data = request.data
        if 'nombre' in data: piloto.nombre = data['nombre']
        if 'nacionalidad' in data: piloto.nacionalidad = data['nacionalidad']
        if 'foto_url' in data: piloto.foto_url = data['foto_url']
        piloto.save()
        
        return Response({'mensaje': 'Piloto actualizado'})

    def delete(self, request, pk):
        if not request.user.perfil.equipo_administrado: return Response(status=403)
        equipo_del_jefe = request.user.perfil.equipo_administrado
        
        piloto = get_object_or_404(Piloto, pk=pk, equipo=equipo_del_jefe)
        piloto.delete()
        
        return Response({'mensaje': 'Piloto eliminado'})
