from rest_framework import serializers
from .models import Organizacion, Categoria, Equipo, Piloto, Noticia
from django.contrib.auth.models import User


# 1. PILOTO
class PilotoSerializer(serializers.ModelSerializer):
    nombre_equipo = serializers.CharField(source='equipo.nombre', read_only=True)
    class Meta:
        model = Piloto
        fields = '__all__'

# 2. EQUIPO (Aquí estaba el problema, usamos __all__ para que mande facebook, web, etc.)
class EquipoSerializer(serializers.ModelSerializer):
    pilotos = PilotoSerializer(many=True, read_only=True)
    nombre_categoria = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = Equipo
        fields = '__all__' 

# 3. CATEGORÍA
class CategoriaSerializer(serializers.ModelSerializer):
    equipos = EquipoSerializer(many=True, read_only=True)
    
    # Datos extra de la Organización
    nombre_organizacion = serializers.CharField(source='organizacion.nombre', read_only=True)
    logo_organizacion = serializers.URLField(source='organizacion.logo_url', read_only=True)
    siglas_organizacion = serializers.CharField(source='organizacion.siglas', read_only=True)
    
    # Redes de la Organización (para el encabezado pequeño)
    org_web = serializers.URLField(source='organizacion.web_oficial', read_only=True)
    org_facebook = serializers.URLField(source='organizacion.facebook', read_only=True)
    org_instagram = serializers.URLField(source='organizacion.instagram', read_only=True)
    org_twitter = serializers.URLField(source='organizacion.twitter', read_only=True)
    org_youtube = serializers.URLField(source='organizacion.youtube', read_only=True)

    class Meta:
        model = Categoria
        fields = '__all__'

# 4. ORGANIZACIÓN
class OrganizacionSerializer(serializers.ModelSerializer):
    categorias = CategoriaSerializer(many=True, read_only=True)
    class Meta:
        model = Organizacion
        fields = '__all__'

# 5. NOTICIA
class NoticiaSerializer(serializers.ModelSerializer):
    # Traemos los nombres para mostrar "Etiquetas" bonitas en el blog
    nombre_organizacion = serializers.CharField(source='organizacion.nombre', read_only=True)
    nombre_categoria = serializers.CharField(source='categoria.nombre', read_only=True)
    nombre_equipo = serializers.CharField(source='equipo.nombre', read_only=True)

    class Meta:
        model = Noticia
        fields = '__all__'


# Serializador para crear usuarios
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user