from django.db import models
from django.contrib.auth.models import User

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    due_date = models.DateField()
    blood_type = models.CharField(max_length=5, blank=True)
    emergency_contact = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialty = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50)
    years_of_experience = models.IntegerField()
    
    def __str__(self):
        return f"Dr. {self.user.last_name}"

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    appointment_date = models.DateTimeField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=(
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ), default='scheduled')
    
    def __str__(self):
        return f"Appointment with {self.doctor} on {self.appointment_date}"

class HealthRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    record_date = models.DateField(auto_now_add=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    blood_pressure = models.CharField(max_length=20)
    fetal_heart_rate = models.IntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Health record for {self.patient} on {self.record_date}"

class MoodEntry(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    entry_date = models.DateTimeField(auto_now_add=True)
    journal_text = models.TextField()
    sentiment_score = models.DecimalField(max_digits=5, decimal_places=4, null=True)
    sentiment_label = models.CharField(max_length=20, null=True)
    
    def __str__(self):
        return f"Mood entry for {self.patient} on {self.entry_date}"