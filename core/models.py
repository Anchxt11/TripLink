from django.db import models

class Users(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=100)
    phone_number = models.CharField(unique=True, max_length=15, blank=True, null=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'users'

class Drivers(models.Model):
    user = models.OneToOneField(Users, models.DO_NOTHING)
    license_number = models.CharField(unique=True, max_length=50)
    vehicle_make = models.CharField(max_length=50)
    vehicle_model = models.CharField(max_length=50)
    vehicle_plate = models.CharField(unique=True, max_length=20)
    vehicle_color = models.CharField(max_length=30, blank=True, null=True)
    vehicle_year = models.IntegerField(blank=True, null=True)
    is_verified = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = True    
        db_table = 'drivers'

class Rides(models.Model):
    driver = models.ForeignKey(Users, models.DO_NOTHING)
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure_date = models.DateField()
    departure_time = models.TimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    seats_available = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'rides'

class Bookings(models.Model):
    ride = models.ForeignKey(Rides, models.DO_NOTHING)
    passenger = models.ForeignKey(Users, models.DO_NOTHING)
    seats_booked = models.IntegerField(blank=True, null=True)
    booking_status = models.CharField(max_length=9, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'bookings'
