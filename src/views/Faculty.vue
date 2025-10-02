<template>
  <div class="app-container">
    <div class="main-wrapper">
      <div class="content-wrapper">
        <header class="header">
          <div class="header-background">
            <img alt="University campus" class="header-bg-image"
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1200" />
            <div class="header-gradient"></div>
          </div>
          <div class="header-content">
            <div class="welcome-section">
              <p class="welcome-text">Welcome back,</p>
              <h1 class="user-name">Prof. {{ userName }}</h1>
            </div>
            <button @click="handleNotifications" class="notification-btn">
              <span class="material-symbols-outlined">notifications</span>
              <span v-if="hasNotifications" class="notification-badge"></span>
            </button>
          </div>
        </header>

        <main class="main-content">

          <div class="qr-card">
            <div class="qr-card-content">
              <div class="qr-icon-container">
                <span class="material-symbols-outlined qr-icon">playlist_add_check_circle</span>
              </div>
              <h2 class="qr-title">Start a New Attendance Session</h2>
              <p class="qr-description">
                Begin tracking attendance for your current class. Students can check in using QR or Face Scan.
              </p>
              <button @click="startNewSession" class="qr-scan-btn">
                <span class="material-symbols-outlined">add_task</span>
                <span>Start Session</span>
              </button>
            </div>
          </div>

          <div v-if="activeSession" class="active-session">
            <h2>Ongoing Session: {{ activeSession.subject }}</h2>
            <p>{{ activeSession.time }}</p>
            <div class="live-attendance">
              <h3>Live Attendance</h3>
              <ul>
                <li v-for="student in liveStudents" :key="student.id">
                  ✅ {{ student.name }}
                </li>
                <li v-if="liveStudents.length === 0">No students checked in yet...</li>
              </ul>
            </div>
            <button @click="endSession" class="end-btn">
              <span class="material-symbols-outlined">stop_circle</span> End Session
            </button>
          </div>

          <div class="line-break" style="margin: 0 auto; width: 70%; background-color: lightgray; height: 1px;"></div>

          <div class="schedule-container">
            <header class="schedule-header">
              <h2 class="schedule-title">Attendance History</h2>
            </header>
            <div class="schedule-body">
              <div v-if="historyWithStats.length > 0">
                <div v-for="session in historyWithStats" :key="session.id" class="schedule-item">
                  <div class="schedule-time-col">{{ session.date }}</div>
                  <div class="schedule-card schedule-card--history">
                    <div class="session-info">
                       <p class="schedule-subject">{{ session.subject }}</p>
                       <p class="schedule-time-range">{{ session.time }}</p>
                    </div>
                    <div class="attendance-stats">
                        <div class="stat-item">
                            <span class="stat-value">{{ session.present }}/{{ session.total }}</span>
                            <span class="stat-label">Present</span>
                        </div>
                        <div class="progress-wrapper">
                             <div class="progress-container">
                                <div class="progress-bar" :class="session.status" :style="{ width: session.percentage + '%' }"></div>
                             </div>
                             <span class="percentage-label">{{ session.percentage }}%</span>
                        </div>
                    </div>
                    <button class="export-btn" @click="exportReport(session)">
                      <span class="material-symbols-outlined">summarize</span> View Report
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="no-classes">
                <p>No past attendance sessions yet.</p>
              </div>
            </div>
          </div>

          <div class="notifications-container">
            <header class="schedule-header">
              <h2 class="schedule-title">Notifications</h2>
            </header>
            <div class="notifications-body">
              <div v-if="notifications.length > 0">
                <div v-for="notification in notifications" :key="notification.id" class="notification-card">
                  <div class="notification-icon" :class="`icon-${notification.type}`">
                    <span class="material-symbols-outlined">{{ notification.icon }}</span>
                  </div>
                  <div class="notification-content">
                    <p class="notification-title">{{ notification.title }}</p>
                    <p class="notification-time">{{ notification.time }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="no-classes">
                <p>No new notifications.</p>
              </div>
            </div>
          </div>

        </main>
      </div>
      <NavComp />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import NavComp from '../components/nav.vue'

const userName = ref('Jezwin')
const hasNotifications = ref(true)

// Active session state
const activeSession = ref(null)
const liveStudents = ref([])
let pollInterval = null // 🔹 to store polling interval id

// Attendance history
const history = ref([
  { id: 1, date: 'Sep 10', subject: 'Physics', time: '10:00 - 11:30 AM', present: 25, total: 30 },
  { id: 2, date: 'Sep 12', subject: 'Chemistry', time: '1:00 - 2:00 PM', present: 28, total: 30 },
  { id: 3, date: 'Sep 13', subject: 'Advanced Physics', time: '9:00 - 10:30 AM', present: 15, total: 30 },
])

// Notifications
const notifications = ref([
    { id: 1, type: 'success', icon: 'download_done', title: "Physics report for Sep 10 is ready.", time: "2 days ago" },
    { id: 2, type: 'warning', icon: 'warning', title: "3 students have low attendance in Chemistry.", time: "1 day ago" },
    { id: 3, type: 'info', icon: 'campaign', title: "System maintenance scheduled for tonight.", time: "3 hours ago" }
])

// Attendance stats
const historyWithStats = computed(() => {
  return history.value.map(session => {
    const percentage = Math.round((session.present / session.total) * 100);
    let status = 'progress-high';
    if (percentage < 75) status = 'progress-medium';
    if (percentage < 50) status = 'progress-low';
    return { ...session, percentage, status };
  });
})

const getUserDetails = () => {
  const storedData = localStorage.getItem("signupData")
  if (!storedData) return
  const formData = JSON.parse(storedData)
  userName.value = formData.fullName.split(" ")[0]
  return formData.registerNumber
}

// 🔹 Fetch live attendance from backend
const fetchLiveAttendance = async () => {
  try {
    const res = await fetch("https://5af483c564df.ngrok-free.app/attendance/session/summary",       {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      })
    if (!res.ok) throw new Error("Failed to fetch attendance summary")
    const data = await res.json()

    // Update UI with actual present students
    liveStudents.value = data.present_roll_numbers.map((roll, idx) => ({
      id: idx,
      name: roll
    }))
  } catch (err) {
    console.error("Error fetching attendance summary:", err)
  }
}

// 🔹 Start new session with backend call
const startNewSession = async () => {
  try {
    const faculty_id = getUserDetails()
    if (!faculty_id) {
      console.error("No faculty_id found in localStorage")
      return
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude

      const payload = {
        faculty_id,
        lat,
        lon,
        radius_meters: 50,
        remarks: ""
      }

      const res = await fetch("https://5af483c564df.ngrok-free.app/attendance/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Failed to create session")

      const data = await res.json()
      console.log("Session created:", data)

      activeSession.value = {
        subject: 'Advanced Physics',
        time: 'Now - 1:00 PM'
      }
      liveStudents.value = []

      // 🔹 Start polling backend every 5 seconds
      pollInterval = setInterval(fetchLiveAttendance, 5000)
    })
  } catch (err) {
    console.error("Error starting session:", err)
  }
}


// 🔹 End session
const endSession = async () => {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }

  history.value.unshift({
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    subject: activeSession.value.subject,
    time: activeSession.value.time,
    present: liveStudents.value.length,
    total: 30
  })
  activeSession.value = null
  console.log("Session ended")
  let registerno = ref('')
    const storedData = localStorage.getItem("signupData")
        const formData = JSON.parse(storedData)
        registerno.value = formData.registerNumber

        const res = await fetch(`https://5af483c564df.ngrok-free.app/attendance/session/end/${registerno.value}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) throw new Error("Failed to create session")

}

const exportReport = (session) => {
  console.log("Viewing report for session:", session)
}

const handleNotifications = () => {
  console.log("Notifications clicked")
}

onMounted(() => {
  getUserDetails()
})

onBeforeUnmount(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>



<style scoped>
/* --- NEW & REVAMPED STYLES --- */

/* History Card Revamp */
.schedule-card--history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.attendance-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    font-weight: 700;
    font-size: 1rem;
    color: #111827;
}

.stat-label {
    font-size: 0.75rem;
    color: #6b7280;
}

.progress-wrapper {
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.progress-container {
  width: 100%;
  background-color: #e5e7eb;
  border-radius: 99px;
  height: 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 99px;
  transition: width 0.5s ease-in-out;
}

.percentage-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
}

/* Color codes for progress bar */
.progress-high { background-color: #22c55e; } /* Green */
.progress-medium { background-color: #f59e0b; } /* Amber */
.progress-low { background-color: #ef4444; } /* Red */

.export-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  align-self: flex-start; /* Align button to the left */
}

.export-btn:hover {
  background: #4338ca;
}

.notifications-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.notifications-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #f9fafb;
  padding: 1rem;
  border: 1px solid #f3f4f6;
}

.notification-card:first-child {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.notification-card:last-child {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.notification-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}
.notification-icon .material-symbols-outlined {
  font-size: 22px;
}
.notification-content {
  flex-grow: 1;
}
.notification-title {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  font-size: 14px;
}
.notification-time {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Icon colors for different notification types */
.icon-success { background-color: #dcfce7; color: #16a34a; }
.icon-warning { background-color: #fef3c7; color: #d97706; }
.icon-info { background-color: #dbeafe; color: #2563eb; }

/* --- EXISTING STYLES (slightly adjusted for consistency) --- */
.active-session {
  background-color: #eef2ff;
  border: 1px solid #c7d2fe;
  padding: 1rem;
  border-radius: 12px;
}
.live-attendance {
  margin: 1rem 0;
  background: white;
  padding: 1rem;
  border-radius: 8px;
}
.end-btn {
  background: #ef4444;
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.active-session {
  background-color: #eef2ff;
  border: 1px solid #c7d2fe;
  padding: 1rem;
  border-radius: 12px;
  margin-top: 1.5rem;
}

.active-session h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #1e3a8a;
}

.live-attendance {
  margin: 1rem 0;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.live-attendance h3 {
  margin: 0 0 0.8rem 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.live-attendance ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.live-attendance li {
  padding: 6px 0;
  font-size: 14px;
  border-bottom: 1px solid #f3f4f6;
}

.end-btn {
  background: #ef4444;
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 1rem;
}

.end-btn:hover {
  background: #dc2626;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.nav-icon--outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

* {
  box-sizing: border-box;
}

.app-container {
  background-color: white;
  font-family: Manrope, "Noto Sans", sans-serif;
}

.main-wrapper {
  position: relative;
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: hidden;
}

.content-wrapper {
  flex-grow: 1;
}

.header {
  position: relative;
  background-color: white;
  padding: 24px 18px 76px;
}

.header-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.header-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.1;
}

.header-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, white, transparent);
}

.header-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome-text {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  margin-bottom: 0.4rem;
}

.user-name {
  color: #111827;
  font-size: 30px;
  font-weight: 700;
  margin: 0;
}

.notification-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  color: #4b5563;
  border: 1px solid rgba(229, 231, 235, 0.5);
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background-color: #ef4444;
  border: 2px solid white;
}

.main-content {
  padding: 16px;
  padding-bottom: 6rem;
  margin-top: -64px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.qr-card {
  z-index: 100;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.qr-card-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.qr-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  width: 56px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  margin-bottom: 12px;
}

.qr-icon {
  font-size: 26px !important;
  color: white;
}

.qr-title {
  line-height: 2rem;
  color: white;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.qr-description {
  color: #c7d2fe;
  font-size: 14px;
  width: 80.5%;
  line-height: 18px;
  margin: 0 0 20px 0;
}

.qr-scan-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  background-color: white;
  color: #4f46e5;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  width: 100%;
}

@media (min-width: 768px) {
  .qr-scan-btn {
    width: auto;
  }
}

body {
  margin: 0;
  padding: 0;
}

.schedule-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
}

.schedule-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.schedule-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: flex;
  align-items: stretch;
  gap: 8px;
}

.schedule-time-col {
  font-size: 10px;
  color: #9ca3af;
  padding-top: 4px;
  padding-left: 0.5rem;
  line-height: 1rem;
  text-transform: uppercase;
  width: 60px;
  text-align: left;
  flex-shrink: 0;
}

.schedule-card {
  flex-grow: 1;
  background-color: #f9fafb;
  padding: 16px;
  border-left: 4px solid;
}

.schedule-subject {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
}

.schedule-time-range {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.no-classes {
  text-align: center;
  padding: 3rem 1rem;
  color: #888;
  background-color: #f9f9f9;
  border-radius: 12px;
  margin: 1rem 0;
}

.schedule-card--history {
  border-color: #ec4899;
  background-color: #fdf2f8;
}
</style>