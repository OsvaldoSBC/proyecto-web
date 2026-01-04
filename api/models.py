
from django.db import models
from django.contrib.auth.models import User
# 1. ORGANIZACIÓN
class Organizacion(models.Model):
    nombre = models.CharField(max_length=100)
    siglas = models.CharField(max_length=20)
    descripcion = models.TextField()
    logo_url = models.URLField(verbose_name="URL del Logo")
    web_oficial = models.URLField(blank=True, null=True, verbose_name="Sitio Web")
    facebook = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    youtube = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.nombre

# 2. CATEGORÍA 
class Categoria(models.Model):
    organizacion = models.ForeignKey(Organizacion, related_name='categorias', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    activa = models.BooleanField(default=True, verbose_name="¿Serie Activa?")
    foto_url = models.URLField(verbose_name="URL de la Foto")
    video_url = models.URLField(null=True, blank=True)
    calendario_url = models.URLField(null=True, blank=True)
    
    # --- REDES SOCIALES PROPIAS DE LA CATEGORÍA ---
    web_oficial = models.URLField(blank=True, null=True, verbose_name="Sitio Web Oficial")
    facebook = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    youtube = models.URLField(blank=True, null=True)

    def __str__(self):
        estado = "✅" if self.activa else "❌"
        return f"{self.nombre} ({estado})"

# 3. EQUIPO
class Equipo(models.Model):
    categoria = models.ForeignKey(Categoria, related_name='equipos', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    
    # Redes Sociales (Opcionales)
    web_oficial = models.URLField(blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.nombre

# 4. PILOTO
class Piloto(models.Model):
    equipo = models.ForeignKey(Equipo, related_name='pilotos', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)

    apodo = models.CharField(max_length=50, blank=True, null=True)
    foto_url = models.URLField(verbose_name="URL Foto Piloto", blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} - {self.equipo.nombre}"

# 5. NOTICIAS
class Noticia(models.Model):
    titulo = models.CharField(max_length=200)
    resumen = models.TextField(help_text="Texto corto para la tarjeta de previsualización")
    cuerpo = models.TextField(verbose_name="Contenido Completo de la Noticia") # <--- NUEVO: El artículo entero
    imagen_url = models.URLField(verbose_name="URL de la Imagen Principal")
    fecha = models.DateTimeField(auto_now_add=True)

    # --- RELACIONES OPCIONALES (TAGS) ---
    # Esto permite vincular la noticia a quien quieras. Pueden quedar vacíos.
    organizacion = models.ForeignKey(Organizacion, on_delete=models.SET_NULL, null=True, blank=True, related_name="noticias")
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, related_name="noticias")
    equipo = models.ForeignKey(Equipo, on_delete=models.SET_NULL, null=True, blank=True, related_name="noticias")

    def __str__(self):
        return self.titulo
    
class PerfilUsuario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    # Aquí guardamos a qué categorías sigue. ManyToMany significa "Un usuario sigue muchas categorías"
    suscripciones = models.ManyToManyField(Categoria, blank=True, related_name="suscriptores")

    def __str__(self):
        return f"Perfil de {self.usuario.username}"