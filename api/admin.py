from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Organizacion, Categoria, Equipo, Piloto, Noticia, PerfilUsuario, Video

# --- INLINES (Tablas hijas) ---

class PilotoInline(admin.TabularInline):
    model = Piloto
    extra = 1
    fields = ('nombre', 'nacionalidad', 'foto_url', 'apodo')

class VideoInline(admin.TabularInline):
    model = Video
    extra = 1

class EquipoInline(admin.TabularInline):
    model = Equipo
    extra = 1
    fields = ('nombre', 'web_oficial', 'instagram')
    show_change_link = True

class CategoriaInline(admin.TabularInline):
    model = Categoria
    extra = 0
    fields = ('nombre', 'activa', 'link_a_equipos')
    readonly_fields = ('link_a_equipos',)

    def link_a_equipos(self, obj):
        if obj.id:
            url = reverse("admin:api_categoria_change", args=[obj.id])
            return format_html('<a class="button" href="{}" style="background-color: #E10600; color: white; padding: 5px 10px; border-radius: 5px;">Gestionar Equipos 🏎️</a>', url)
        return "Guarda primero"
    
    link_a_equipos.short_description = "Ir a Detalles"

# --- FILTROS PERSONALIZADOS ---

class TieneJefeFilter(admin.SimpleListFilter):
    title = '¿Tiene Jefe de Equipo?'
    parameter_name = 'con_jefe'

    def lookups(self, request, model_admin):
        return (
            ('si', 'Con Jefe Asignado'),
            ('no', 'Sin Jefe (Huérfano)'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'si':
            return queryset.filter(administrador__isnull=False)
        if self.value() == 'no':
            return queryset.filter(administrador__isnull=True)

# --- PANELES DE ADMINISTRACIÓN (ADMINS) ---

@admin.register(Organizacion)
class OrganizacionAdmin(admin.ModelAdmin):
    inlines = [CategoriaInline]
    list_display = ('nombre', 'siglas', 'web_oficial')

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):

    inlines = [EquipoInline, VideoInline] 
    list_display = ('nombre', 'organizacion', 'activa')
    list_filter = ('organizacion', 'activa')
    search_fields = ('nombre',)

# FUSIÓN: Aquí unimos el Inline de Pilotos con el Filtro de Managers
@admin.register(Equipo)
class EquipoAdmin(admin.ModelAdmin):
    inlines = [PilotoInline] 
    list_display = ('nombre', 'categoria', 'ver_manager', 'pilotos_count')
    list_filter = ('categoria', TieneJefeFilter) 
    search_fields = ('nombre', 'administrador__usuario__username')

    def ver_manager(self, obj):
        if hasattr(obj, 'administrador'):
            return f"👤 {obj.administrador.usuario.username.upper()}"
        return "❌ ---"
    ver_manager.short_description = "Jefe de Equipo"

    def pilotos_count(self, obj):
        return obj.pilotos.count()
    pilotos_count.short_description = "Nº Pilotos"

# --- REGISTROS SIMPLES ---
admin.site.register(Piloto)
admin.site.register(Noticia)
admin.site.register(Video) 

@admin.register(PerfilUsuario)
class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'total_suscripciones', 'equipo_administrado')
    filter_horizontal = ('suscripciones',)
    
    def total_suscripciones(self, obj):
        return obj.suscripciones.count()