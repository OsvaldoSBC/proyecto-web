from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Organizacion, Categoria, Equipo, Piloto, Noticia

# --- NIVEL 3: PILOTOS (Dentro de Equipo) ---
class PilotoInline(admin.TabularInline):
    model = Piloto
    extra = 1
    fields = ('nombre', 'foto_url', 'instagram')

# --- NIVEL 2: EQUIPOS (Dentro de Categoría) ---
class EquipoInline(admin.TabularInline):
    model = Equipo
    extra = 1
    fields = ('nombre', 'web_oficial', 'instagram')
    show_change_link = True

# --- NIVEL 1: CATEGORÍAS (Dentro de Organización) ---
class CategoriaInline(admin.TabularInline):
    model = Categoria
    extra = 0 # No mostramos filas vacías extra para que se vea limpio
    
    # Mostramos el nombre, si está activa y NUESTRO BOTÓN MÁGICO
    fields = ('nombre', 'activa', 'link_a_equipos')
    readonly_fields = ('link_a_equipos',) # Es solo lectura porque es un link

    # Esta función crea el botón HTML
    def link_a_equipos(self, obj):
        if obj.id:
            # Buscamos la URL de edición de esta categoría
            url = reverse("admin:api_categoria_change", args=[obj.id])
            # Retornamos un botón HTML
            return format_html('<a class="button" href="{}" style="background-color: #E10600; color: white; padding: 5px 10px; border-radius: 5px;">Gestionar Equipos 🏎️</a>', url)
        return "Guarda primero"
    
    link_a_equipos.short_description = "Ir a Detalles"

# --- PANELES PRINCIPALES ---

class EquipoAdmin(admin.ModelAdmin):
    inlines = [PilotoInline]
    list_display = ('nombre', 'categoria', 'instagram')
    search_fields = ('nombre',)
    list_filter = ('categoria',)

class CategoriaAdmin(admin.ModelAdmin):
    inlines = [EquipoInline] # <--- Gracias a esto, al dar click en el botón, verás los equipos
    list_display = ('nombre', 'organizacion', 'activa')
    list_filter = ('organizacion', 'activa')
    search_fields = ('nombre',)

class OrganizacionAdmin(admin.ModelAdmin):
    inlines = [CategoriaInline]
    list_display = ('nombre', 'siglas', 'web_oficial')

# --- REGISTRO ---
admin.site.register(Organizacion, OrganizacionAdmin)
admin.site.register(Categoria, CategoriaAdmin)
admin.site.register(Equipo, EquipoAdmin)
admin.site.register(Piloto)
admin.site.register(Noticia)