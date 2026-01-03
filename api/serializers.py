from rest_framework import serializers
from .models import ElementoWeb

class ElementoWebSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElementoWeb
        fields = '__all__'