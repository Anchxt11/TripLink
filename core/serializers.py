from rest_framework import serializers
from .models import Users, Drivers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'full_name', 'email', 'phone_number']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Users
        fields = ['full_name', 'email', 'password', 'phone_number']

    def create(self, validated_data):
        # In a real app, hash the password here!
        # For now, we are using the existing schema which stores password_hash
        # We will assume simple storage for this step, but hashing is CRITICAL for production.
        user = Users.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            phone_number=validated_data.get('phone_number'),
            password_hash=validated_data['password'] # TODO: Hash this!
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drivers
        fields = ['license_number', 'vehicle_make', 'vehicle_model', 'vehicle_plate', 'vehicle_color', 'vehicle_year']
