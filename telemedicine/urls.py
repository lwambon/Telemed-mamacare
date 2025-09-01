from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

def redirect_to_frontend(request):
    return redirect('/static/index.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.urls')),
    path('', redirect_to_frontend),
]