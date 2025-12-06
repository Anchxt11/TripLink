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

@api_view(['GET', 'POST'])
def driver_profile_api(request):
    if request.method == 'GET':
        email = request.query_params.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = Users.objects.get(email=email)
            driver = Drivers.objects.get(user=user)
            serializer = DriverSerializer(driver)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except (Users.DoesNotExist, Drivers.DoesNotExist):
            return Response({"error": "Driver profile not found"}, status=status.HTTP_404_NOT_FOUND)

    # POST Request logic
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = Users.objects.get(email=email)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if Drivers.objects.filter(user=user).exists():
        return Response({"error": "Driver profile already exists"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = DriverSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response({
            "message": "Driver profile created successfully",
            "driver": serializer.data
        }, status=status.HTTP_201_CREATED)
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
    print(f"DEBUG: Initial count: {rides.count()}")

    if origin:
        print(f"DEBUG: Filtering by origin: {origin}")
        rides = rides.filter(origin__icontains=origin)
    if destination:
        print(f"DEBUG: Filtering by destination: {destination}")
        rides = rides.filter(destination__icontains=destination)
    if date:
        print(f"DEBUG: Filtering by date: {date}")
        rides = rides.filter(departure_date=date)
    
    print(f"DEBUG: Final count: {rides.count()}")

    # Order by date and time
    rides = rides.order_by('departure_date', 'departure_time')

    serializer = RideSerializer(rides, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
