from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView  # Add this import
from django.views.generic.base import RedirectView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.urls')),
    path('', RedirectView.as_view(url='/static/index.html'), name='home'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)