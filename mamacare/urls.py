from django.urls import include, path
from rest_framework import routers
from .views import api_overview, get_patient_appointments, create_appointment
from .views import PatientViewSet, DoctorViewSet, AppointmentViewSet, HealthRecordViewSet, MoodEntryViewSet

router = routers.DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'healthrecords', HealthRecordViewSet)
router.register(r'moodentries', MoodEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('overview/', api_overview, name='api-overview'),
    path('patient/<int:patient_id>/appointments/', 
         get_patient_appointments, name='patient-appointments'),
    path('appointment/create/', 
         create_appointment, name='create-appointment'),
]