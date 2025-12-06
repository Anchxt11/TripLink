from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Users, Drivers, Rides
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, DriverSerializer, RideSerializer
from datetime import datetime

@api_view(['POST'])
def register_api(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "User registered successfully",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_api(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = Users.objects.get(email=email)
            # TODO: Use proper password hashing check!
            if user.password_hash == password:
                return Response({
                    "message": "Login successful",
                    "user": UserSerializer(user).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except Users.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def driver_profile_api(request):
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Users.objects.get(email=email)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        driver = Drivers.objects.get(user=user)
        serializer = DriverSerializer(driver, data=request.data, partial=True)
    except Drivers.DoesNotExist:
        # Create new driver profile
        # We need to pass the user instance manually since it's not in the request data
        serializer = DriverSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response({
                "message": "Driver profile created successfully",
                "driver": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if serializer.is_valid():
        serializer.save()
        return Response({
            "message": "Driver profile updated successfully",
            "driver": serializer.data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def offer_ride_api(request):
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Users.objects.get(email=email)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if user is a driver
    try:
        driver = Drivers.objects.get(user=user)
    except Drivers.DoesNotExist:
        return Response({"error": "You must create a driver profile first"}, status=status.HTTP_403_FORBIDDEN)

    serializer = RideSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(driver=user) # Save with the user instance as driver
        return Response({
            "message": "Ride published successfully",
            "ride": serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def find_ride_api(request):
    origin = request.query_params.get('origin')
    destination = request.query_params.get('destination')
    date = request.query_params.get('date')

    rides = Rides.objects.all()

    if origin:
        rides = rides.filter(origin__icontains=origin)
    if destination:
        rides = rides.filter(destination__icontains=destination)
    if date:
        rides = rides.filter(departure_date=date)

    # Order by date and time
    rides = rides.order_by('departure_date', 'departure_time')

    serializer = RideSerializer(rides, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
