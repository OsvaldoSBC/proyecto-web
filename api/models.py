
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


# Modelo para Organizaciones (ej. FIA, IndyCar)
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

# Modelo para Categorías o Series de carreras
class Categoria(models.Model):
    organizacion = models.ForeignKey(Organizacion, related_name='categorias', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    activa = models.BooleanField(default=True, verbose_name="¿Serie Activa?")
    foto_url = models.URLField(verbose_name="URL de la Foto")
    video_url = models.URLField(null=True, blank=True)
    calendario_url = models.URLField(null=True, blank=True)
    
    web_oficial = models.URLField(blank=True, null=True, verbose_name="Sitio Web Oficial")
    facebook = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    youtube = models.URLField(blank=True, null=True)

    def __str__(self):
        estado = "✅" if self.activa else "❌"
        return f"{self.nombre} ({estado})"
    
class Video(models.Model):
    titulo = models.CharField(max_length=100)
    url_youtube = models.URLField()
    # related_name='videos' es CLAVE para que el Serializer de Categoria lo encuentre
    categoria = models.ForeignKey(Categoria, related_name='videos', on_delete=models.CASCADE)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo

# Modelo para Equipos de competición
class Equipo(models.Model):
    nombre = models.CharField(max_length=100)
    logo_url = models.URLField(blank=True, null=True)
    web_oficial = models.URLField(blank=True, null=True)
    twitter = models.CharField(max_length=100, blank=True, null=True)
    instagram = models.CharField(max_length=100, blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)
    categoria = models.ForeignKey(Categoria, related_name='equipos', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.nombre

# Modelo para Pilotos asociados a un equipo
class Piloto(models.Model):
    nombre = models.CharField(max_length=100)
    apodo = models.CharField(max_length=50, blank=True, null=True)
    nacionalidad = models.CharField(max_length=50, default='INT') 
    
    foto_url = models.URLField(blank=True, null=True)
    instagram = models.CharField(max_length=100, blank=True, null=True)
    
    equipo = models.ForeignKey(Equipo, related_name='pilotos', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.nombre

# Modelo para Noticias y Resultados de carreras
class Noticia(models.Model):
    TIPOS = (
        ('NOTICIA', 'Noticia General'),
        ('RESULTADO', 'Resultado de Carrera'),
    )

    titulo = models.CharField(max_length=200)
    resumen = models.TextField(blank=True, null=True)
    contenido = models.TextField(blank=True, null=True)
    imagen_url = models.URLField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    fecha_manual = models.DateTimeField(null=True, blank=True, verbose_name="Fecha Manual (Opcional)")
    tipo = models.CharField(max_length=20, choices=TIPOS, default='NOTICIA')
    link_resultado = models.URLField(blank=True, null=True, help_text="Poner aquí el link al PDF o tabla de tiempos (solo para Resultados)")

    organizacion = models.ForeignKey(Organizacion, on_delete=models.CASCADE, null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, null=True, blank=True)
    equipo = models.ForeignKey(Equipo, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"[{self.tipo}] {self.titulo}"
    
# Perfil extendido de usuario para gestión de suscripciones y roles
class PerfilUsuario(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    suscripciones = models.ManyToManyField(Categoria, blank=True, related_name='suscriptores')
    equipo_administrado = models.OneToOneField(
        'Equipo', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='administrador'
    )

    def __str__(self):
        return self.usuario.username

@receiver(post_save, sender=User)
def crear_perfil_usuario(sender, instance, created, **kwargs):
    if created:
        PerfilUsuario.objects.create(usuario=instance)