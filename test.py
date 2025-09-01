#!/usr/bin/env python
import os
import sys
import django

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'telemedicine.settings')
django.setup()

# Test imports
try:
    from app import models, views, serializers
    print("✓ All imports successful!")
    print("✓ Models module found")
    print("✓ Views module found")
    
    # Check if serializers.py exists
    serializers_path = os.path.join(os.path.dirname(__file__), 'mamacare', 'serializers.py')
    if os.path.exists(serializers_path):
        print("✓ Serializers module found")
    else:
        print("✗ Serializers module not found - creating it...")
        # Create the serializers.py file
        with open(serializers_path, 'w') as f:
            f.write('''from rest_framework import serializers
from .models import Patient, Doctor, Appointment, HealthRecord, MoodEntry

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

class HealthRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecord
        fields = '__all__'

class MoodEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodEntry
        fields = '__all__'
''')
        print("✓ Serializers module created")
        
except ImportError as e:
    print(f"✗ Import error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"✗ Error: {e}")
    sys.exit(1)