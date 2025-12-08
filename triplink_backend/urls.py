from django.contrib import admin
from django.urls import path
from core import views
from core import api_views

urlpatterns = [
    path('admin/', admin.site.urls),
    # API Endpoints
    path('api/register/', api_views.register_api, name='api_register'),
    path('api/login/', api_views.login_api, name='api_login'),
    path('api/driver-profile/', api_views.driver_profile_api, name='api_driver_profile'),
    path('api/offer-ride/', api_views.offer_ride_api, name='api_offer_ride'),
    path('api/find-ride/', api_views.find_ride_api, name='api_find_ride'),
    path('api/book-ride/', api_views.book_ride_api, name='api_book_ride'),
    path('api/my-trips/', api_views.my_trips_api, name='api_my_trips'),
    
    # Frontend Views (Keep these for now if serving HTML from Django, 
    # but Netlify will use the API endpoints above)
    path('', views.index, name='home'),
    path('login.html', views.login_view, name='login'),
    path('index.html', views.index, name='index'),
    path('register.html', views.register_view, name='register'),
    path('find-ride.html', views.find_ride, name='find_ride'),
    path('offer-ride.html', views.offer_ride, name='offer_ride'),
    path('profile.html', views.profile, name='profile'),
]
