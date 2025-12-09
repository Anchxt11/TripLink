from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Users, Drivers, Rides, Bookings
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, DriverSerializer, RideSerializer, BookingSerializer
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
        
        user = Users.objects.filter(email=email).first()
        if user and user.password_hash == password:
            return Response({
                "message": "Login successful",
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def driver_profile_api(request):
    if request.method == 'GET':
        email = request.query_params.get('email')
        try:
            # Optimization: Fetch driver directly via user email relationship
            driver = Drivers.objects.get(user__email=email)
            return Response(DriverSerializer(driver).data, status=status.HTTP_200_OK)
        except Drivers.DoesNotExist:
            return Response({"error": "Driver profile not found"}, status=status.HTTP_404_NOT_FOUND)

    # POST Request logic
    email = request.data.get('email')
    
    # Check for user existence
    user = Users.objects.filter(email=email).first()
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check for existing driver profile
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

@api_view(['POST'])
def book_ride_api(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        passenger_email = serializer.validated_data['passenger_email']
        ride_id = serializer.validated_data['ride_id']
        seats_to_book = serializer.validated_data['seats_booked']

        try:
            user = Users.objects.get(email=passenger_email)
        except Users.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            ride = Rides.objects.get(id=ride_id)
        except Rides.DoesNotExist:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

        if ride.seats_available < seats_to_book:
            return Response({"error": "Not enough seats available"}, status=status.HTTP_400_BAD_REQUEST)

        booking = Bookings.objects.create(
            ride=ride,
            passenger=user,
            seats_booked=seats_to_book,
            booking_status='confirmed'
        )

        ride.seats_available -= seats_to_book
        ride.save()

        return Response({
            "message": "Ride booked successfully",
            "booking_id": booking.id,
            "ride_details": {
                "origin": ride.origin,
                "destination": ride.destination,
                "date": ride.departure_date,
                "time": ride.departure_time
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def my_trips_api(request):
    email = request.query_params.get('email')

    
    try:
        user = Users.objects.get(email=email)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    bookings = Bookings.objects.filter(passenger=user).order_by('-created_at')
    booked_serializer = BookingSerializer(bookings, many=True)

    offered_rides = Rides.objects.filter(driver=user).order_by('-departure_date')
    offered_serializer = RideSerializer(offered_rides, many=True)

    return Response({
        "booked": booked_serializer.data,
        "offered": offered_serializer.data
    }, status=status.HTTP_200_OK)
