from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def login_view(request):
    return render(request, 'login.html')

def register_view(request):
    return render(request, 'register.html')

def find_ride(request):
    return render(request, 'find-ride.html')

def offer_ride(request):
    return render(request, 'offer-ride.html')

def profile(request):
    return render(request, 'profile.html')
