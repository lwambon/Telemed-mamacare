// Global variables
let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || [];
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;
}

// Core application functions
function initApp() {
  setupEventListeners();
  checkLoginStatus();
  initMoodChart();
  updateForumTopics();
}

function setupEventListeners() {
  const loginBtn = document.getElementById("login-btn");
  const profileBtn = document.getElementById("profile-btn");
  const authModal = document.getElementById("auth-modal");
  const closeModal = document.querySelectorAll(".close");

  loginBtn.addEventListener("click", function () {
    if (currentUser) {
      openUserProfile();
    } else {
      authModal.style.display = "block";
    }
  });

  profileBtn.addEventListener("click", function () {
    openUserProfile();
  });

  closeModal.forEach(function (closeBtn) {
    closeBtn.addEventListener("click", function () {
      this.closest(".modal").style.display = "none";
    });
  });

  const authTabBtns = document.querySelectorAll(".auth-tab-btn");
  const authForms = document.querySelectorAll(".auth-form");

  authTabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const tab = this.getAttribute("data-tab");

      authTabBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      this.classList.add("active");

      authForms.forEach(function (form) {
        form.classList.remove("active");
      });
      document.getElementById(`${tab}-form`).classList.add("active");
    });
  });

  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleLogin();
  });

  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    handleSignup();
  });

  const profileForm = document.getElementById("profile-form");
  if (profileForm) {
    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();
      updateProfile();
    });
  }

  const passwordForm = document.getElementById("password-form");
  if (passwordForm) {
    passwordForm.addEventListener("submit", function (e) {
      e.preventDefault();
      changePassword();
    });
  }

  const appointmentForm = document.getElementById("appointment-form");
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      scheduleAppointment();
    });
  }

  const tabBtns = document.querySelectorAll(".tab-btn");

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const tab = this.getAttribute("data-tab");

      tabBtns.forEach(function (b) {
        b.classList.remove("active");
      });
      this.classList.add("active");

      document.querySelectorAll(".tab-content").forEach(function (content) {
        content.classList.remove("active");
      });
      document.getElementById(`${tab}-content`).classList.add("active");
    });
  });

  const analyzeBtn = document.getElementById("analyze-btn");
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", function () {
      analyzeMood();
    });
  }

  const calculateBtn = document.getElementById("calculate-due-date");
  if (calculateBtn) {
    calculateBtn.addEventListener("click", function () {
      calculateDueDate();
    });
  }

  const heroAppointmentBtn = document.getElementById("hero-appointment-btn");
  if (heroAppointmentBtn) {
    heroAppointmentBtn.addEventListener("click", function () {
      document
        .getElementById("appointment")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  const feedbackForm = document.getElementById("feedback-form");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", handleFeedbackSubmission);
  }

  window.addEventListener("click", function (e) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(function (modal) {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });
}

function checkLoginStatus() {
  const userData = localStorage.getItem("currentUser");
  const loginBtn = document.getElementById("login-btn");
  const profileBtn = document.getElementById("profile-btn");
  const logoutBtn = document.getElementById("logout-btn");

  if (userData) {
    currentUser = JSON.parse(userData);
    loginBtn.textContent = "My Profile";
    profileBtn.style.display = "inline-flex";
    logoutBtn.style.display = "inline-flex";
  } else {
    loginBtn.textContent = "Login / Sign Up";
    profileBtn.style.display = "none";
    logoutBtn.style.display = "none";
  }
}

// Authentication functions
function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));

    document.getElementById("login-btn").textContent = "My Profile";
    document.getElementById("profile-btn").style.display = "inline-flex";
    document.getElementById("logout-btn").style.display = "inline-flex";
    document.getElementById("auth-modal").style.display = "none";

    alert(`Login successful! Welcome back, ${user.name}!`);
  } else {
    alert("Invalid email or password. Please try again.");
  }
}

function handleSignup() {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const dueDate = document.getElementById("signup-due-date").value;

  if (users.some((u) => u.email === email)) {
    alert("User with this email already exists. Please login instead.");
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    dueDate,
    bloodType: "",
    emergencyContact: "",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  currentUser = newUser;

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  document.getElementById("login-btn").textContent = "My Profile";
  document.getElementById("profile-btn").style.display = "inline-flex";
  document.getElementById("logout-btn").style.display = "inline-flex";
  document.getElementById("auth-modal").style.display = "none";

  alert("Account created successfully! Welcome to MamaCare!");
}

function handleLogout() {
  localStorage.removeItem("currentUser");
  currentUser = null;

  const loginBtn = document.getElementById("login-btn");
  loginBtn.textContent = "Login / Sign Up";
  document.getElementById("profile-btn").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";

  const profileModal = document.getElementById("profile-modal");
  profileModal.style.display = "none";

  alert("You have been logged out successfully.");
}

// Profile functions
function openUserProfile() {
  if (!currentUser) {
    alert("Please login to view your profile");
    document.getElementById("auth-modal").style.display = "block";
    return;
  }

  const profileModal = document.getElementById("profile-modal");
  const userAppointments = appointments.filter(
    (apt) => apt.userId === currentUser.id,
  );
  const userMoodHistory = moodHistory.filter(
    (mood) => mood.userId === currentUser.id,
  );
  const recentMood = userMoodHistory.slice(-30);

  document.getElementById("profile-name").textContent = currentUser.name;
  document.getElementById("profile-email").textContent = currentUser.email;
  document.getElementById("profile-due-date").textContent = currentUser.dueDate
    ? `Due Date: ${formatDate(currentUser.dueDate)}`
    : "Due Date: Not specified";
  document.getElementById("profile-blood-type").textContent =
    currentUser.bloodType
      ? `Blood Type: ${currentUser.bloodType}`
      : "Blood Type: Not specified";

  if (currentUser.dueDate) {
    document.getElementById("profile-due-date-input").value =
      currentUser.dueDate;
  }

  if (currentUser.bloodType) {
    document.getElementById("profile-blood-type-select").value =
      currentUser.bloodType;
  }

  if (currentUser.emergencyContact) {
    document.getElementById("profile-emergency-contact").value =
      currentUser.emergencyContact;
  }

  displayUserAppointments(userAppointments);
  displayMoodAnalysis(recentMood);

  profileModal.style.display = "block";
}

function displayUserAppointments(userAppointments) {
  const appointmentsContainer = document.getElementById("user-appointments");

  if (userAppointments.length === 0) {
    appointmentsContainer.innerHTML =
      '<p class="no-appointments">You have no upcoming appointments.</p>';
    return;
  }

  let appointmentsHTML =
    '<h3>Your Appointments</h3><div class="appointments-list">';

  userAppointments.forEach((apt) => {
    const aptDate = new Date(apt.date);
    const now = new Date();
    const isUpcoming = aptDate > now;

    appointmentsHTML += `
                    <div class="appointment-item ${isUpcoming ? "upcoming" : "past"}">
                        <div class="apt-info">
                            <h4>Appointment with ${apt.doctor}</h4>
                            <p><strong>Date:</strong> ${formatDate(apt.date)} at ${apt.time}</p>
                            <p><strong>Reason:</strong> ${apt.reason}</p>
                            <p class="apt-status">${isUpcoming ? "Upcoming" : "Completed"}</p>
                        </div>
                    </div>
                `;
  });

  appointmentsHTML += "</div>";
  appointmentsContainer.innerHTML = appointmentsHTML;
}

function updateProfile() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (user) {
    const dueDate = document.getElementById("profile-due-date-input").value;
    const bloodType = document.getElementById(
      "profile-blood-type-select",
    ).value;
    const emergencyContact = document.getElementById(
      "profile-emergency-contact",
    ).value;

    user.dueDate = dueDate;
    user.bloodType = bloodType;
    user.emergencyContact = emergencyContact;

    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
    }

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    document.getElementById("profile-due-date").textContent = dueDate
      ? `Due Date: ${formatDate(dueDate)}`
      : "Due Date: Not specified";

    document.getElementById("profile-blood-type").textContent = bloodType
      ? `Blood Type: ${bloodType}`
      : "Blood Type: Not specified";

    alert("Profile updated successfully!");
  }
}

function changePassword() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (user) {
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (currentPassword !== user.password) {
      alert("Current password is incorrect.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    user.password = newPassword;

    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
    }

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    document.getElementById("password-form").reset();

    alert("Password changed successfully!");
  }
}

// Appointment functions
function scheduleAppointment() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    alert("Please login to schedule an appointment.");
    document.getElementById("auth-modal").style.display = "block";
    return;
  }

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const dueDate = document.getElementById("due-date").value;
  const doctor = document.getElementById("doctor").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const reason = document.getElementById("reason").value;

  if (!name || !email || !doctor || !date || !time) {
    alert("Please fill out all required fields.");
    return;
  }

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

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
    status: "scheduled",
    createdAt: new Date().toISOString(),
  };

  appointments.push(newAppointment);

  localStorage.setItem("appointments", JSON.stringify(appointments));

  document.getElementById("appointment-form").reset();

  alert(
    "Appointment scheduled successfully! You will receive a confirmation email shortly.",
  );
}

// Mood tracker functions
function analyzeMood() {
  const text = document.getElementById("mood-text").value;

  if (!text) {
    alert("Please enter some text to analyze");
    return;
  }

  // Show loading spinner
  document.getElementById("mood-spinner").style.display = "block";
  document.getElementById("analyze-btn").disabled = true;

  // Simulate API call with timeout
  setTimeout(() => {
    const sentimentData = analyzePregnancyMood(text);

    const resultDiv = document.getElementById("mood-result");
    resultDiv.style.display = "block";
    resultDiv.className = "mood-result " + sentimentData.label.toLowerCase();

    document.getElementById("mood-text-result").textContent =
      sentimentData.text;
    document.getElementById("sentiment-score").textContent =
      `Confidence: ${(sentimentData.score * 100).toFixed(1)}%`;

    showMoodSuggestions(sentimentData.label);
    saveMoodHistory(sentimentData);
    updateMoodChart();

    // Hide loading spinner
    document.getElementById("mood-spinner").style.display = "none";
    document.getElementById("analyze-btn").disabled = false;
  }, 2000);
}

function analyzePregnancyMood(text) {
  // Pregnancy-specific keywords for more accurate sentiment analysis
  const positiveWords = [
    "excited",
    "happy",
    "joy",
    "love",
    "grateful",
    "thankful",
    "blessed",
    "thrilled",
    "wonderful",
    "amazing",
    "good",
    "great",
    "perfect",
    "bliss",
    "content",
    "peaceful",
    "calm",
    "relaxed",
    "optimistic",
    "hopeful",
    "looking forward",
    "can't wait",
    "eager",
    "enthusiastic",
    "energetic",
    "healthy",
    "well",
    "fine",
    "okay",
    "alright",
    "better",
    "improving",
    "support",
    "help",
    "care",
    "understanding",
    "patient",
    "kind",
    "nice",
  ];

  const negativeWords = [
    "sad",
    "depressed",
    "anxious",
    "worried",
    "stressed",
    "overwhelmed",
    "tired",
    "exhausted",
    "fatigued",
    "weary",
    "drained",
    "burned out",
    "frustrated",
    "angry",
    "irritated",
    "annoyed",
    "upset",
    "mad",
    "scared",
    "afraid",
    "fearful",
    "terrified",
    "panicked",
    "nervous",
    "pain",
    "hurt",
    "ache",
    "sore",
    "uncomfortable",
    "discomfort",
    "nauseous",
    "sick",
    "ill",
    "unwell",
    "queasy",
    "vomit",
    "throw up",
    "lonely",
    "alone",
    "isolated",
    "abandoned",
    "neglected",
    "ignored",
    "confused",
    "unsure",
    "uncertain",
    "doubtful",
    "hesitant",
    "ambivalent",
  ];

  const textLower = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach((word) => {
    const regex = new RegExp("\\b" + word + "\\b", "g");
    const matches = textLower.match(regex);
    if (matches) positiveCount += matches.length;
  });

  negativeWords.forEach((word) => {
    const regex = new RegExp("\\b" + word + "\\b", "g");
    const matches = textLower.match(regex);
    if (matches) negativeCount += matches.length;
  });

  // Additional pregnancy-specific context analysis
  const pregnancyContext = {
    hasSymptoms:
      /(morning sickness|nausea|vomiting|heartburn|back pain|swelling|fatigue|constipation)/i.test(
        text,
      ),
    hasConcerns:
      /(worry|concern|scared|anxious|nervous|what if|what happens if)/i.test(
        text,
      ),
    hasPositive:
      /(excit|happy|joy|love|grateful|thankful|blessed|thrill|wonderful|amazing)/i.test(
        text,
      ),
    hasQuestions: /\?/.test(text),
  };

  // Calculate score with context weighting
  let score = 0;
  let label = "NEUTRAL";

  if (positiveCount > negativeCount) {
    score = 0.7 + (positiveCount - negativeCount) * 0.05;
    score = Math.min(0.95, score);
    label = "POSITIVE";

    // Adjust based on pregnancy context
    if (pregnancyContext.hasSymptoms) score -= 0.1;
    if (pregnancyContext.hasConcerns) score -= 0.1;
  } else if (negativeCount > positiveCount) {
    score = 0.3 - (negativeCount - positiveCount) * 0.05;
    score = Math.max(0.05, score);
    label = "NEGATIVE";

    // Adjust based on pregnancy context
    if (pregnancyContext.hasPositive) score += 0.1;
  } else {
    score = 0.5;
    label = "NEUTRAL";
  }

  // Generate appropriate response text
  let responseText = "";

  if (label === "POSITIVE") {
    responseText =
      "You seem to be in a positive mood today! It's wonderful that you're feeling good during your pregnancy.";
    if (pregnancyContext.hasSymptoms) {
      responseText +=
        " Even with some pregnancy symptoms, you're maintaining a positive outlook.";
    }
  } else if (label === "NEGATIVE") {
    responseText =
      "It seems you might be feeling down today. Pregnancy can bring many physical and emotional changes.";
    if (pregnancyContext.hasSymptoms) {
      responseText +=
        " Dealing with pregnancy symptoms can certainly affect your mood.";
    }
    responseText +=
      " Remember that it's okay to not be okay, and support is available.";
  } else {
    responseText =
      "Your mood appears neutral today. Pregnancy is a journey with ups and downs, and sometimes steady is just what we need.";
  }

  return {
    label: label,
    score: score,
    text: responseText,
  };
}

function showMoodSuggestions(sentiment) {
  const suggestionsDiv = document.getElementById("mood-suggestions");

  if (sentiment === "POSITIVE") {
    suggestionsDiv.innerHTML = `
                    <h5>Suggestions to maintain your positive mood:</h5>
                    <ul>
                        <li>Share your positive energy with other expecting mothers in our community</li>
                        <li>Take a moment to journal about what's making you happy in your pregnancy</li>
                        <li>Engage in light prenatal exercise like walking or yoga</li>
                        <li>Practice gratitude by noting three things you appreciate about your pregnancy journey</li>
                    </ul>
                `;
  } else if (sentiment === "NEGATIVE") {
    suggestionsDiv.innerHTML = `
                    <h5>Suggestions to improve your mood:</h5>
                    <ul>
                        <li>Practice deep breathing exercises to reduce stress</li>
                        <li>Take a gentle walk in nature to clear your mind</li>
                        <li>Listen to calming music or pregnancy meditation guides</li>
                        <li>Reach out to your healthcare provider if these feelings persist or intensify</li>
                        <li>Connect with other expecting mothers who may be experiencing similar feelings</li>
                    </ul>
                `;
  } else {
    suggestionsDiv.innerHTML = `
                    <h5>Suggestions to enhance your day:</h5>
                    <ul>
                        <li>Try a new relaxing activity suitable for pregnancy</li>
                        <li>Connect with friends or family for support</li>
                        <li>Practice mindfulness meditation focused on your baby</li>
                        <li>Read something uplifting about pregnancy and childbirth</li>
                    </ul>
                `;
  }
}

function saveMoodHistory(sentimentData) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (user) {
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

    const newEntry = {
      userId: user.id,
      date: new Date().toISOString(),
      sentiment: sentimentData.label,
      score: sentimentData.score,
      text:
        document.getElementById("mood-text").value.substring(0, 100) + "...",
    };

    moodHistory.push(newEntry);
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
  }
}

function initMoodChart() {
  const ctx = document.getElementById("mood-chart");
  if (!ctx) return;

  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) return;

  const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
  const userMoodHistory = moodHistory.filter(
    (entry) => entry.userId === user.id,
  );

  if (userMoodHistory.length === 0) {
    ctx.getContext("2d").fillText("No mood data available yet", 150, 100);
    return;
  }

  const recentHistory = userMoodHistory.slice(-7);

  const dates = recentHistory.map((entry) => formatDateShort(entry.date));
  const scores = recentHistory.map((entry) => entry.score * 100);
  const sentiments = recentHistory.map((entry) => entry.sentiment);

  const colors = sentiments.map((sentiment) => {
    if (sentiment === "POSITIVE") return "rgba(76, 175, 80, 0.7)";
    if (sentiment === "NEGATIVE") return "rgba(244, 67, 54, 0.7)";
    return "rgba(255, 152, 0, 0.7)";
  });

  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Mood Score (%)",
          data: scores,
          backgroundColor: colors,
          borderColor: colors.map((color) => color.replace("0.7", "1")),
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
    },
  });
}

function updateMoodChart() {
  initMoodChart();
}

function displayMoodAnalysis(recentMood) {
  const moodContainer = document.getElementById("user-mood-analysis");

  if (recentMood.length === 0) {
    moodContainer.innerHTML =
      '<p class="no-mood-data">No mood data available for the past 30 days.</p>';
    return;
  }

  const sentimentCount = {
    POSITIVE: 0,
    NEGATIVE: 0,
    NEUTRAL: 0,
  };

  recentMood.forEach((entry) => {
    if (sentimentCount[entry.sentiment] !== undefined) {
      sentimentCount[entry.sentiment]++;
    }
  });

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

  renderMoodChart(sentimentCount);
}

function getDominantMood(sentimentCount) {
  const max = Math.max(
    sentimentCount.POSITIVE,
    sentimentCount.NEGATIVE,
    sentimentCount.NEUTRAL,
  );

  if (max === sentimentCount.POSITIVE) return "positive";
  if (max === sentimentCount.NEGATIVE) return "a bit down";
  return "balanced";
}

function renderMoodChart(sentimentCount) {
  const ctx = document.getElementById("mood-chart").getContext("2d");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [
        {
          data: [
            sentimentCount.POSITIVE,
            sentimentCount.NEUTRAL,
            sentimentCount.NEGATIVE,
          ],
          backgroundColor: [
            "rgba(76, 175, 80, 0.7)",
            "rgba(255, 152, 0, 0.7)",
            "rgba(244, 67, 54, 0.7)",
          ],
          borderColor: [
            "rgba(76, 175, 80, 1)",
            "rgba(255, 152, 0, 1)",
            "rgba(244, 67, 54, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

// Due date calculator
function calculateDueDate() {
  const lmpDate = new Date(document.getElementById("lmp-date").value);
  const cycleLength = parseInt(document.getElementById("cycle-length").value);

  if (isNaN(lmpDate.getTime())) {
    alert("Please enter a valid date for your last menstrual period.");
    return;
  }

  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280);

  const cycleAdjustment = (cycleLength - 28) * 0.15;
  dueDate.setDate(dueDate.getDate() + Math.round(cycleAdjustment));

  const today = new Date();
  const daysPassed = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
  const weeksPassed = Math.floor(daysPassed / 7);
  const progressPercent = Math.min(100, (daysPassed / 280) * 100);

  const resultDiv = document.getElementById("due-date-result");
  resultDiv.innerHTML = `
                <h3>${formatDate(dueDate.toISOString())}</h3>
                <p>Based on your last menstrual period and cycle length</p>
            `;

  const progressBar = document.getElementById("pregnancy-progress");
  progressBar.style.width = `${progressPercent}%`;

  document.getElementById("pregnancy-weeks").textContent =
    `${weeksPassed} weeks ${daysPassed % 7} days`;
}

// Community functions
function handleFeedbackSubmission(e) {
  e.preventDefault();

  if (!currentUser) {
    alert("Please login to submit feedback.");
    document.getElementById("auth-modal").style.display = "block";
    return;
  }

  const name = document.getElementById("feedback-name").value;
  const content = document.getElementById("feedback-content").value;

  if (!name || !content) {
    alert("Please fill out all fields.");
    return;
  }

  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  const newFeedback = {
    id: Date.now(),
    userId: currentUser.id,
    userName: name,
    content: content,
    date: new Date().toISOString(),
    likes: 0,
    comments: [],
  };

  feedbacks.push(newFeedback);

  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  document.getElementById("feedback-form").reset();

  updateForumTopics();

  alert("Thank you for your feedback! It has been posted to the community.");
}

function updateForumTopics() {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  const forumTopics = document.getElementById("forum-topics");

  if (feedbacks.length === 0) {
    forumTopics.innerHTML =
      "<p>No discussions yet. Be the first to start a conversation!</p>";
    return;
  }

  const recentFeedbacks = feedbacks
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  let forumHTML = "";

  recentFeedbacks.forEach((feedback) => {
    const date = new Date(feedback.date);
    const timeAgo = getTimeAgo(date);

    forumHTML += `
                    <div class="forum-topic">
                        <h4><i class="fas fa-comment"></i> ${feedback.content.substring(0, 60)}${feedback.content.length > 60 ? "..." : ""}</h4>
                        <p>${feedback.comments.length} comments • Started by ${feedback.userName} ${timeAgo}</p>
                    </div>
                `;
  });

  forumTopics.innerHTML = forumHTML;
}

// Mobile menu functionality
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");
    });

    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
      });
    });

    document.addEventListener("click", function (event) {
      if (
        !event.target.closest("nav") &&
        !event.target.closest(".mobile-menu-btn")
      ) {
        navMenu.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
      }
    });
  }
});

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initApp();
});
