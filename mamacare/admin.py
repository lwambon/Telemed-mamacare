from django.contrib import admin
from .models import Patient, Doctor, Appointment, HealthRecord, MoodEntry

admin.site.register(Patient)
admin.site.register(Doctor)
admin.site.register(Appointment)
admin.site.register(HealthRecord)
admin.site.register(MoodEntry)