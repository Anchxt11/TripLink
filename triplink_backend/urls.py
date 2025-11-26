from django.contrib import admin
from django.urls import path
from core import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='home'),
    path('login.html', views.login_view, name='login'),
    path('index.html', views.index, name='index'),
    path('register.html', views.register_view, name='register'),
    path('find-ride.html', views.find_ride, name='find_ride'),
    path('offer-ride.html', views.offer_ride, name='offer_ride'),
    path('profile.html', views.profile, name='profile'),
]
