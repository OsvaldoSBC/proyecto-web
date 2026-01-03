from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ElementoWeb
from .serializers import ElementoWebSerializer

@api_view(['GET'])
def lista_elementos(request):
    # 1. Sacamos todos los datos de la Base de Datos
    elementos = ElementoWeb.objects.all()
    
    # 2. Los pasamos por el "Traductor" (Serializer)
    serializer = ElementoWebSerializer(elementos, many=True)
    
    # 3. Respondemos con los datos ya traducidos (JSON)
    return Response(serializer.data)