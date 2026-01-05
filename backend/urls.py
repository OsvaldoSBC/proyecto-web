from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Servir assets compilados en modo Debug
if settings.DEBUG:
    assets_root = settings.DIST_DIR / 'assets'
    urlpatterns += static('/assets/', document_root=assets_root)

# Ruta "Catch-all" para delegar el enrutamiento al Frontend (React)
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]