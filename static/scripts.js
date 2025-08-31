    // DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Initialize the application
function initApp() {
    // Set up event listeners
    setupEventListeners();
    
    // Check if user is logged in
    checkLoginStatus();
    
    // Initialize mood chart
    initMoodChart();
}

// Set up event listeners
function setupEventListeners() {
    // Auth modal
    const loginBtn = document.getElementById('login-btn');
    const authModal = document.getElementById('auth-modal');
    const closeModal = document.querySelectorAll('.close');
    
    loginBtn.addEventListener('click', function() {
        authModal.style.display = 'block';
    });
    
    closeModal.forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Auth tabs
    const authTabBtns = document.querySelectorAll('.auth-tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Update active tab
            authTabBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(function(form) {
                form.classList.remove('active');
            });
            document.getElementById(`${tab}-form`).classList.add('active');
        });
    });
    
    // Auth forms submission
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup();
    });
    
    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile();
        });
    }
    
    // Password form submission
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            changePassword();
        });
    }
    
    // Appointment form submission
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            scheduleAppointment();
        });
    }
    
    // Resource tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Update active tab
            tabBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.tab-content').forEach(function(content) {
                content.classList.remove('active');
            });
            document.getElementById(`${tab}-content`).classList.add('active');
        });
    });
    
    // Mood analysis
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            analyzeMood();
        });
    }
    
    // Due date calculator
    const calculateBtn = document.getElementById('calculate-due-date');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            calculateDueDate();
        });
    }
    
    // Hero appointment button
    const heroAppointmentBtn = document.getElementById('hero-appointment-btn');
    if (heroAppointmentBtn) {
        heroAppointmentBtn.addEventListener('click', function() {
            document.getElementById('appointment').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(function(modal) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Check login status
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.getElementById('login-btn');
    
    if (user) {
        loginBtn.textContent = 'My Profile';
        loginBtn.removeEventListener('click', openAuthModal);
        loginBtn.addEventListener('click', openProfileModal);
    }
}

// Open profile modal
function openProfileModal() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const profileModal = document.getElementById('profile-modal');
    
    if (user) {
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-due-date').textContent = user.dueDate ? 
            `Due Date: ${formatDate(user.dueDate)}` : 'Due Date: Not specified';
        
        if (user.dueDate) {
            document.getElementById('profile-due-date-input').value = user.dueDate;
        }
        
        if (user.bloodType) {
            document.getElementById('profile-blood-type').value = user.bloodType;
        }
        
        if (user.emergencyContact) {
            document.getElementById('profile-emergency-contact').value = user.emergencyContact;
        }
    }
    
    profileModal.style.display = 'block';
}

// Handle login
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI
        document.getElementById('login-btn').textContent = 'My Profile';
        document.getElementById('auth-modal').style.display = 'none';
        
        // Show success message
        alert('Login successful! Welcome back!');
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

// Handle signup
function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const dueDate = document.getElementById('signup-due-date').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        alert('User with this email already exists. Please login instead.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        dueDate,
        bloodType: '',
        emergencyContact: '',
        createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Update UI
    document.getElementById('login-btn').textContent = 'My Profile';
    document.getElementById('auth-modal').style.display = 'none';
    
    // Show success message
    alert('Account created successfully! Welcome to MamaCare!');
}

// Update profile
function updateProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (user) {
        // Get updated values
        const dueDate = document.getElementById('profile-due-date-input').value;
        const bloodType = document.getElementById('profile-blood-type').value;
        const emergencyContact = document.getElementById('profile-emergency-contact').value;
        
        // Update user object
        user.dueDate = dueDate;
        user.bloodType = bloodType;
        user.emergencyContact = emergencyContact;
        
        // Update in users array
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
        }
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI
        document.getElementById('profile-due-date').textContent = dueDate ? 
            `Due Date: ${formatDate(dueDate)}` : 'Due Date: Not specified';
        
        // Show success message
        alert('Profile updated successfully!');
    }
}

// Change password
function changePassword() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (user) {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Verify current password
        if (currentPassword !== user.password) {
            alert('Current password is incorrect.');
            return;
        }
        
        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
            return;
        }
        
        // Update password
        user.password = newPassword;
        
        // Update in users array
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
        }
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Reset form
        document.getElementById('password-form').reset();
        
        // Show success message
        alert('Password changed successfully!');
    }
}

// Schedule appointment
function scheduleAppointment() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        alert('Please login to schedule an appointment.');
        document.getElementById('auth-modal').style.display = 'block';
        return;
    }
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const dueDate = document.getElementById('due-date').value;
    const doctor = document.getElementById('doctor').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const reason = document.getElementById('reason').value;
    
    // Basic validation
    if (!name || !email || !doctor || !date || !time) {
        alert('Please fill out all required fields.');
        return;
    }
    
    // Get appointments from localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    
    // Create new appointment
    const newAppointment = {
        id: Date.now(),
        userId: user.id,
        patientName: name,
        patientEmail: email,
        dueDate,
        doctor,
        date,
        time,
        reason,
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };
    
    // Add to appointments array
    appointments.push(newAppointment);
    
    // Save to localStorage
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    // Reset form
    document.getElementById('appointment-form').reset();
    
    // Show success message
    alert('Appointment scheduled successfully! You will receive a confirmation email shortly.');
}

// Analyze mood
function analyzeMood() {
    const text = document.getElementById('mood-text').value;
    
    if (!text) {
        alert('Please enter some text to analyze');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        const sentimentData = simulateSentimentAnalysis(text);
        
        // Display results
        const resultDiv = document.getElementById('mood-result');
        resultDiv.style.display = 'block';
        resultDiv.className = 'mood-result ' + sentimentData.label.toLowerCase();
        
        document.getElementById('mood-text-result').textContent = sentimentData.text;
        document.getElementById('sentiment-score').textContent = `Confidence: ${(sentimentData.score * 100).toFixed(1)}%`;
        
        // Show suggestions based on sentiment
        showMoodSuggestions(sentimentData.label);
        
        // Save to mood history
        saveMoodHistory(sentimentData);
        
        // Update mood chart
        updateMoodChart();
    }, 1500);
}

// Simulate sentiment analysis
function simulateSentimentAnalysis(text) {
    // Simple simulation of sentiment analysis
    const positiveWords = ['good', 'great', 'happy', 'excited', 'wonderful', 'love', 'nice', 'joy', 'bliss', 'content'];
    const negativeWords = ['bad', 'sad', 'worried', 'scared', 'angry', 'hate', 'terrible', 'anxious', 'stress', 'fear'];
    
    const textLower = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
        const regex = new RegExp('\\b' + word + '\\b', 'g');
        const matches = textLower.match(regex);
        if (matches) positiveCount += matches.length;
    });
    
    negativeWords.forEach(word => {
        const regex = new RegExp('\\b' + word + '\\b', 'g');
        const matches = textLower.match(regex);
        if (matches) negativeCount += matches.length;
    });
    
    if (positiveCount > negativeCount) {
        return {
            label: 'POSITIVE',
            score: 0.95,
            text: 'You seem to be in a positive mood today! Keep up the positive energy!'
        };
    } else if (negativeCount > positiveCount) {
        return {
            label: 'NEGATIVE',
            score: 0.85,
            text: 'It seems you might be feeling down today. Remember that it\'s okay to not be okay.'
        };
    } else {
        return {
            label: 'NEUTRAL',
            score: 0.75,
            text: 'Your mood appears neutral today. Sometimes steady is just what we need.'
        };
    }
}

// Show mood suggestions
function showMoodSuggestions(sentiment) {
    const suggestionsDiv = document.getElementById('mood-suggestions');
    suggestionsDiv.innerHTML = '';
    
    if (sentiment === 'POSITIVE') {
        suggestionsDiv.innerHTML = `
            <h5>Suggestions to maintain your positive mood:</h5>
            <ul>
                <li>Share your positive energy with others</li>
                <li>Take a moment to journal about what's making you happy</li>
                <li>Engage in light exercise like prenatal yoga</li>
                <li>Connect with other expecting mothers in our community</li>
            </ul>
        `;
    } else if (sentiment === 'NEGATIVE') {
        suggestionsDiv.innerHTML = `
            <h5>Suggestions to improve your mood:</h5>
            <ul>
                <li>Practice deep breathing exercises</li>
                <li>Take a gentle walk in nature</li>
                <li>Listen to calming music</li>
                <li>Reach out to your healthcare provider if these feelings persist</li>
            </ul>
        `;
    } else {
        suggestionsDiv.innerHTML = `
            <h5>Suggestions to enhance your day:</h5>
            <ul>
                <li>Try a new relaxing activity</li>
                <li>Connect with friends or family</li>
                <li>Practice mindfulness meditation</li>
                <li>Read something uplifting</li>
            </ul>
        `;
    }
}

// Save mood history
function saveMoodHistory(sentimentData) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (user) {
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
        
        const newEntry = {
            userId: user.id,
            date: new Date().toISOString(),
            sentiment: sentimentData.label,
            score: sentimentData.score,
            text: document.getElementById('mood-text').value.substring(0, 100) + '...'
        };
        
        moodHistory.push(newEntry);
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    }
}

// Initialize mood chart
function initMoodChart() {
    const ctx = document.getElementById('mood-chart');
    if (!ctx) return;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
    const userMoodHistory = moodHistory.filter(entry => entry.userId === user.id);
    
    if (userMoodHistory.length === 0) {
        ctx.getContext('2d').fillText('No mood data available yet', 150, 100);
        return;
    }
    
    // Get last 7 entries
    const recentHistory = userMoodHistory.slice(-7);
    
    const dates = recentHistory.map(entry => formatDateShort(entry.date));
    const scores = recentHistory.map(entry => entry.score * 100);
    const sentiments = recentHistory.map(entry => entry.sentiment);
    
    const colors = sentiments.map(sentiment => {
        if (sentiment === 'POSITIVE') return 'rgba(76, 175, 80, 0.7)';
        if (sentiment === 'NEGATIVE') return 'rgba(244, 67, 54, 0.7)';
        return 'rgba(255, 152, 0, 0.7)';
    });
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Mood Score (%)',
                data: scores,
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Update mood chart
function updateMoodChart() {
    initMoodChart();
}

// Calculate due date
function calculateDueDate() {
    const lmpDate = new Date(document.getElementById('lmp-date').value);
    const cycleLength = parseInt(document.getElementById('cycle-length').value);
    
    if (isNaN(lmpDate.getTime())) {
        alert('Please enter a valid date for your last menstrual period.');
        return;
    }
    
    // Calculate due date: typically 40 weeks from LMP
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks * 7 days
    
    // Adjust for cycle length (standard calculation assumes 28-day cycle)
    const cycleAdjustment = (cycleLength - 28) * 0.15; // Approximate adjustment
    dueDate.setDate(dueDate.getDate() + Math.round(cycleAdjustment));
    
    // Calculate current pregnancy progress
    const today = new Date();
    const daysPassed = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.floor(daysPassed / 7);
    const progressPercent = Math.min(100, (daysPassed / 280) * 100);
    
    // Display results
    const resultDiv = document.getElementById('due-date-result');
    resultDiv.innerHTML = `
        <h3>${formatDate(dueDate.toISOString())}</h3>
        <p>Based on your last menstrual period and cycle length</p>
    `;
    
    // Update progress bar
    const progressBar = document.getElementById('pregnancy-progress');
    progressBar.style.width = `${progressPercent}%`;
    
    // Update weeks text
    document.getElementById('pregnancy-weeks').textContent = `${weeksPassed} weeks ${daysPassed % 7} days`;
}

// Format date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Format date to short string
function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
}











// User data structure
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];

// Open user profile modal
function openUserProfile() {
    if (!currentUser) {
        alert('Please login to view your profile');
        document.getElementById('auth-modal').style.display = 'block';
        return;
    }
    
    const profileModal = document.getElementById('profile-modal');
    const userAppointments = appointments.filter(apt => apt.userId === currentUser.id);
    const userMoodHistory = moodHistory.filter(mood => mood.userId === currentUser.id);
    const recentMood = userMoodHistory.slice(-30); // Last 30 days
    
    // Update profile details
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-due-date').textContent = currentUser.dueDate ? 
        `Due Date: ${formatDate(currentUser.dueDate)}` : 'Due Date: Not specified';
    
    // Set form values
    if (currentUser.dueDate) {
        document.getElementById('profile-due-date-input').value = currentUser.dueDate;
    }
    
    if (currentUser.bloodType) {
        document.getElementById('profile-blood-type').value = currentUser.bloodType;
    }
    
    if (currentUser.emergencyContact) {
        document.getElementById('profile-emergency-contact').value = currentUser.emergencyContact;
    }
    
    // Display appointments
    displayUserAppointments(userAppointments);
    
    // Display mood analysis
    displayMoodAnalysis(recentMood);
    
    profileModal.style.display = 'block';
}

// Display user appointments
function displayUserAppointments(userAppointments) {
    const appointmentsContainer = document.getElementById('user-appointments');
    
    if (userAppointments.length === 0) {
        appointmentsContainer.innerHTML = '<p class="no-appointments">You have no upcoming appointments.</p>';
        return;
    }
    
    let appointmentsHTML = '<h3>Your Appointments</h3><div class="appointments-list">';
    
    userAppointments.forEach(apt => {
        const aptDate = new Date(apt.date);
        const now = new Date();
        const isUpcoming = aptDate > now;
        
        appointmentsHTML += `
            <div class="appointment-item ${isUpcoming ? 'upcoming' : 'past'}">
                <div class="apt-info">
                    <h4>Appointment with ${apt.doctor}</h4>
                    <p><strong>Date:</strong> ${formatDate(apt.date)} at ${apt.time}</p>
                    <p><strong>Reason:</strong> ${apt.reason}</p>
                    <p class="apt-status">${isUpcoming ? 'Upcoming' : 'Completed'}</p>
                </div>
            </div>
        `;
    });
    
    appointmentsHTML += '</div>';
    appointmentsContainer.innerHTML = appointmentsHTML;
}

// Display mood analysis
function displayMoodAnalysis(recentMood) {
    const moodContainer = document.getElementById('user-mood-analysis');
    
    if (recentMood.length === 0) {
        moodContainer.innerHTML = '<p class="no-mood-data">No mood data available for the past 30 days.</p>';
        return;
    }
    
    // Count sentiment occurrences
    const sentimentCount = {
        POSITIVE: 0,
        NEGATIVE: 0,
        NEUTRAL: 0
    };
    
    recentMood.forEach(entry => {
        if (sentimentCount[entry.sentiment] !== undefined) {
            sentimentCount[entry.sentiment]++;
        }
    });
    
    // Calculate percentages
    const total = recentMood.length;
    const positivePct = Math.round((sentimentCount.POSITIVE / total) * 100);
    const negativePct = Math.round((sentimentCount.NEGATIVE / total) * 100);
    const neutralPct = Math.round((sentimentCount.NEUTRAL / total) * 100);
    
    let moodHTML = `
        <h3>Mood Analysis (Last 30 Days)</h3>
        <div class="mood-summary">
            <div class="mood-stats">
                <div class="mood-stat positive">
                    <span class="mood-label">Positive</span>
                    <span class="mood-value">${positivePct}%</span>
                </div>
                <div class="mood-stat neutral">
                    <span class="mood-label">Neutral</span>
                    <span class="mood-value">${neutralPct}%</span>
                </div>
                <div class="mood-stat negative">
                    <span class="mood-label">Negative</span>
                    <span class="mood-value">${negativePct}%</span>
                </div>
            </div>
            <div class="mood-chart-container">
                <canvas id="mood-chart" width="400" height="200"></canvas>
            </div>
        </div>
        <div class="mood-trends">
            <h4>Your Mood Trends</h4>
            <p>Based on your recent entries, you've been feeling mostly 
            ${getDominantMood(sentimentCount)} recently.</p>
        </div>
    `;
    
    moodContainer.innerHTML = moodHTML;
    
    // Render chart
    renderMoodChart(sentimentCount);
}

// Get dominant mood description
function getDominantMood(sentimentCount) {
    const max = Math.max(sentimentCount.POSITIVE, sentimentCount.NEGATIVE, sentimentCount.NEUTRAL);
    
    if (max === sentimentCount.POSITIVE) return 'positive';
    if (max === sentimentCount.NEGATIVE) return 'a bit down';
    return 'balanced';
}

// Render mood chart
function renderMoodChart(sentimentCount) {
    const ctx = document.getElementById('mood-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [sentimentCount.POSITIVE, sentimentCount.NEUTRAL, sentimentCount.NEGATIVE],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.7)',
                    'rgba(255, 152, 0, 0.7)',
                    'rgba(244, 67, 54, 0.7)'
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(244, 67, 54, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update the checkLoginStatus function
function checkLoginStatus() {
    const userData = localStorage.getItem('currentUser');
    const loginBtn = document.getElementById('login-btn');
    
    if (userData) {
        currentUser = JSON.parse(userData);
        loginBtn.textContent = `${currentUser.name}'s Profile`;
        loginBtn.removeEventListener('click', openAuthModal);
        loginBtn.addEventListener('click', openUserProfile);
    }
}

// Update the openAuthModal function
function openAuthModal() {
    document.getElementById('auth-modal').style.display = 'block';
}

// Update the handleLogin function to set currentUser
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Set current user
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI
        document.getElementById('login-btn').textContent = `${user.name}'s Profile`;
        document.getElementById('auth-modal').style.display = 'none';
        
        // Show success message
        alert(`Login successful! Welcome back, ${user.name}!`);
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

// Update the handleSignup function to set currentUser
function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const dueDate = document.getElementById('signup-due-date').value;
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        alert('User with this email already exists. Please login instead.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        dueDate,
        bloodType: '',
        emergencyContact: '',
        createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    currentUser = newUser;
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Update UI
    document.getElementById('login-btn').textContent = `${name}'s Profile`;
    document.getElementById('auth-modal').style.display = 'none';
    
    // Show success message
    alert('Account created successfully! Welcome to MamaCare!');
}

// Update the login button click event
loginBtn.addEventListener('click', function() {
    if (currentUser) {
        openUserProfile();
    } else {
        openAuthModal();
    }
});

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
});