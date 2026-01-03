from django.db import models

class ElementoWeb(models.Model):
    titulo = models.CharField(max_length=100)
    descripcion = models.TextField()
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo