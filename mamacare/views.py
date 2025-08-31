from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.http import JsonResponse
import requests
import json
from django.conf import settings

# Import models
from .models import Patient, Doctor, Appointment, HealthRecord, MoodEntry

# Create simple serializers inline to avoid import issues
from rest_framework import serializers

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

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

class HealthRecordViewSet(viewsets.ModelViewSet):
    queryset = HealthRecord.objects.all()
    serializer_class = HealthRecordSerializer

class MoodEntryViewSet(viewsets.ModelViewSet):
    queryset = MoodEntry.objects.all()
    serializer_class = MoodEntrySerializer
    
    @action(detail=False, methods=['post'])
    def analyze_sentiment(self, request):
        journal_text = request.data.get('text', '')
        
        if not journal_text:
            return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Simulate API call delay
        import time
        time.sleep(1)
        
        # Simulate sentiment analysis result
        sentiment_data = self.simulate_sentiment_analysis(journal_text)
        
        return Response(sentiment_data)
    
    def simulate_sentiment_analysis(self, text):
        # Simple simulation of sentiment analysis
        positive_words = ['good', 'great', 'happy', 'excited', 'wonderful', 'love', 'nice']
        negative_words = ['bad', 'sad', 'worried', 'scared', 'angry', 'hate', 'terrible']
        
        positive_count = sum(1 for word in positive_words if word in text.lower())
        negative_count = sum(1 for word in negative_words if word in text.lower())
        
        if positive_count > negative_count:
            return {'label': 'POSITIVE', 'score': 0.95}
        elif negative_count > positive_count:
            return {'label': 'NEGATIVE', 'score': 0.85}
        else:
            return {'label': 'NEUTRAL', 'score': 0.75}

@api_view(['GET'])
def get_patient_appointments(request, patient_id):
    appointments = Appointment.objects.filter(patient_id=patient_id)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_appointment(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'Patient List': '/api/patients/',
        'Doctor List': '/api/doctors/',
        'Appointment List': '/api/appointments/',
        'Create Appointment': '/api/appointment/create/',
        'Sentiment Analysis': '/api/moodentries/analyze_sentiment/',
    }
    return Response(api_urls)