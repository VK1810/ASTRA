<style scoped>
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

.schedule-nav {
  display: flex;
  gap: 16px;
  color: #6b7280;
}

.date-selector {
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.date-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  width: 17%;
}

.date-day {
  margin-bottom: 10px;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.date-number {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.date-item--active {
  background-color: #4f46e5;
  color: white;
}

.date-item--active .date-day,
.date-item--active .date-number {
  color: white;
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
  margin: 0 0 10px 0;
}

.schedule-time-range {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.date-selector {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
}

.active-date-indicator {
  position: absolute;
  top: 0;
  height: 100%;
  background-color: #4f46e5;
  color: #FFF;
  border-radius: 10px;
  transition: left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1;
}

.date-item {
  cursor: pointer;
  z-index: 2;
  transition: color 0.3s ease-in-out;
  flex: 1;
  text-align: center;
  padding: 8px 4px;
  transition: color 0.2s ease-out;

}

.date-item--active-text {
  color: white !important;
  font-weight: bold;

}

.date-item--active-text .date-day,
.date-item--active-text .date-number {
  color: white !important;
  transition: color 0.1s ease-in 0.15s;

}

.no-classes {
  text-align: center;
  padding: 3rem 1rem;
  color: #888;
  background-color: #f9f9f9;
  border-radius: 12px;
  margin: 1rem 0;
}

.schedule-card--physics {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.schedule-card--music {
  border-color: #f97316;
  background-color: #fff7ed;
}

.schedule-card--lunch {
  border-color: #6b7280;
  background-color: #f3f4f6;
}

.schedule-card--art {
  border-color: #8b5cf6;
  background-color: #f5f3ff;
}

.schedule-card--history {
  border-color: #ec4899;
  background-color: #fdf2f8;
}
</style>

<template>
  <div class="app-container">
    <div class="main-wrapper">
      <div class="content-wrapper">
        <header class="header">
          <div class="header-background">
            <img alt="University campus" class="header-bg-image"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzpFKDc8sIppKJ28JAfHPTo71Ask9NKSYlZDlR-SRZSYE_PR48QVhXT62jrYh2WuE5HT7396evUK7UrfViiBQnuufcFFlLbRQ-0UvBPqwwwiX5JqWu0tMsW038K8WIJAhLAxeG4nqx5aI_3TzlTVaqJIPm2AwC3vtoQaoYyZOBQ55Fr3D0of_M3z-4dJwD9uCUa9HSYg-0DTh3S8w3R9Jw2S5QzyUlzF4bLWvPvanNTd29EgO6QgKR8rv-Z8tLICzT0iPAZGITju4" />
            <div class="header-gradient"></div>
          </div>
          <div class="header-content">
            <div class="welcome-section">
              <p class="welcome-text">Welcome back,</p>
              <h1 class="user-name">Hello, {{ userName }}</h1>
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
                <span class="material-symbols-outlined qr-icon">familiar_face_and_zone</span>
              </div>
              <h2 class="qr-title">Check In for Your Next Class</h2>
              <p class="qr-description">Scan your face inside the classroom to mark your attendance.</p>
              <button @click="$router.push('/attendance')" class="qr-scan-btn">
                <span class="material-symbols-outlined">ar_on_you</span>
                <span>Mark Attendance</span>
              </button>
            </div>
          </div>
          <div class="line-break" style=" margin: 0 auto; width: 70%; background-color: lightgray; height: 1px;"></div>

          <div class="schedule-container">
            <header class="schedule-header">
              <h2 class="schedule-title">October</h2>
              <div class="schedule-nav">
                <span class="material-symbols-outlined">chevron_left</span>
                <span class="material-symbols-outlined">chevron_right</span>
              </div>
            </header>

            <div class="date-selector">
              <div class="active-date-indicator" :style="activeIndicatorStyle"></div>

              <div v-for="(date, index) in dates" :key="date.num" :ref="el => { if (el) dateElements[index] = el }"
                class="date-item" :class="{ 'date-item--active-text': selectedDate === date.num }"
                @click="selectDate(date.num)">
                <span class="date-day">{{ date.day }}</span>
                <span class="date-number">{{ date.num }}</span>
              </div>
            </div>

            <div class="schedule-body">
              <div v-if="currentSchedule.length > 0">
                <div v-for="item in currentSchedule" :key="item.subject" class="schedule-item">
                  <div class="schedule-time-col">{{ item.time }}</div>
                  <div class="schedule-card" :class="`schedule-card--${item.type}`">
                    <p class="schedule-subject">{{ item.subject }}</p>
                    <p class="schedule-time-range">{{ item.duration }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="no-classes">
                <p>No classes scheduled for this day. Enjoy your break! 🎉</p>
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
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import NavComp from '../components/nav.vue'

const userName = ref('Jezwin')
const hasNotifications = ref(true)

const selectedDate = ref(15)

const dates = ref([
  { day: 'Mon', num: 15 },
  { day: 'Tue', num: 16 },
  { day: 'Wed', num: 17 },
  { day: 'Thu', num: 18 },
  { day: 'Fri', num: 19 },
  { day: 'Sat', num: 20 },
])

function getUserDetails() {
  const storedData = localStorage.getItem("signupData");
  if (!storedData) {
    console.error("No signup data found in localStorage");
    return;
  }
  const formData = JSON.parse(storedData);
  userName.value = formData.fullName.split(" ")[0]
}

onMounted(() => {
  getUserDetails()
})

const scheduleData = ref({
  14: [ // Monday
    { time: '10:00 AM', subject: 'Calculus', duration: '10:00 - 11:30 AM', type: 'physics' },
    { time: '01:00 PM', subject: 'Literature', duration: '01:00 - 02:30 PM', type: 'history' },
  ],
  15: [ // Tuesday
    { time: '09:00 AM', subject: 'Chemistry Lab', duration: '09:00 AM - 12:00 PM', type: 'art' },
    { time: '02:00 PM', subject: 'Music Theory', duration: '02:00 - 03:00 PM', type: 'music' },
  ],
  16: [ // Wednesday (Original data)
    { time: '09:00 AM', subject: 'Physics', duration: '09:00 - 11:00 AM', type: 'physics' },
    { time: '11:00 AM', subject: 'Music', duration: '11:00 AM - 12:00 PM', type: 'music' },
    { time: '12:00 PM', subject: 'Lunch', duration: '12:00 - 01:00 PM', type: 'lunch' },
    { time: '01:00 PM', subject: 'Art', duration: '01:00 - 02:00 PM', type: 'art' },
    { time: '02:00 PM', subject: 'History', duration: '02:00 - 03:00 PM', type: 'history' },
  ],
  17: [ // Thursday
    { time: '11:00 AM', subject: 'Advanced Physics', duration: '11:00 AM - 01:00 PM', type: 'physics' },
  ],
  18: [ // Friday
    { time: '09:00 AM', subject: 'Studio Art', duration: '09:00 AM - 12:00 PM', type: 'art' },
    { time: '01:00 PM', subject: 'Band Practice', duration: '01:00 - 03:00 PM', type: 'music' },
  ],
  19: [], // Saturday has no classes
})

const currentSchedule = computed(() => {
  return scheduleData.value[selectedDate.value] || []
})

const dateElements = ref([]) // Holds the DOM elements for the dates
const activeIndicatorStyle = ref({}) // Holds the CSS for the sliding indicator

const updateIndicator = () => {
  const activeIndex = dates.value.findIndex(d => d.num === selectedDate.value)
  const activeEl = dateElements.value[activeIndex]

  if (activeEl) {
    activeIndicatorStyle.value = {
      left: `${activeEl.offsetLeft}px`,
      width: `${activeEl.offsetWidth}px`,
    }
  }
}

const selectDate = (dateNum) => {
  selectedDate.value = dateNum
}

watch(selectedDate, async () => {
  await nextTick()
  updateIndicator()
});

onMounted(async () => {
  await nextTick()
  updateIndicator()
})


const handleNotifications = () => {
  console.log('Notifications clicked')
}

const scanQRCode = () => {
  console.log('QR Code scan initiated')
}
</script>