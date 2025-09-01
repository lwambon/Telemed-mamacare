from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView  # Add this import


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.urls')),
    # Add a catch-all route for frontend (if you're serving HTML from Django)
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
]
