<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- Avatar -->
      <div class="avatar-wrapper" :style="{ backgroundColor: avatarColor }">
        <span class="avatar-letter">{{ firstLetter }}</span>
        <button class="edit-avatar-btn">
          <span class="material-symbols-outlined edit-icon">draw</span>
        </button>
      </div>

      <!-- User Info -->
      <div class="user-info">
        <h2 class="user-name">{{ user.fullName }}</h2>
        <p class="reg-no">{{ user.role == 'student' ? 'Student' : 'Professor'}} ID: {{ user.registerNumber }}</p>
        <div class="attendance" v-if="user.role == 'student'">
          <span>Overall Attendance: </span>
          <strong :style="{ color: attendanceColor }">87.6%</strong>
        </div>
      </div>

      <!-- Personal Information -->
      <div class="section">
        <h3>Personal Information</h3>

        <div class="input-field">
          <span class="material-symbols-outlined input-icon">mail</span>
          <input type="text" v-model="user.parentEmail" readonly />
        </div>
      </div>

      <!-- Account Settings -->
      <div class="section">
        <h3>Account Settings</h3>
        <div class="settings-item">
          <span>Change Password</span>
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
        <div class="settings-item">
          <span>Notifications</span>
          <label class="switch">
            <input type="checkbox" v-model="notifications" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Logout -->
      <button class="logout-btn" @click="logout">
        <span class="material-symbols-outlined">logout</span>
        Log Out
      </button>
    </div>
    <NavComp/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import NavComp from "../components/nav.vue"


const router = useRouter();
const notifications = ref(true);

const user = ref({
  fullName: "",
  registerNumber: "",
  email: "",
  parentEmail: "",
  password: "",
  attendance: 0,
});

// Load from localStorage
onMounted(() => {
  const storedData = localStorage.getItem("signupData");
  if (storedData) {
    user.value = JSON.parse(storedData);
    console.log(user.value)
  }
});

// Avatar letter
const firstLetter = computed(() => {
  return user.value.fullName ? user.value.fullName.charAt(0).toUpperCase() : "";
});

// Attendance color
const attendanceColor = computed(() => {
  return user.value.attendance >= 75 ? "#16a34a" : "#dc2626";
});

const avatarColor = computed(() => {
  if (!user.value.fullName) return "#4f46e5";
  let hash = 0;
  for (let i = 0; i < user.value.fullName.length; i++) {
    hash = user.value.fullName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
});

// Logout
const logout = () => {
  localStorage.removeItem("signupData");
  router.push("/signin");
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 20px;
  font-family: "Inter", sans-serif;
}

.profile-card {
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb; /* flat border */
  max-width: 400px;
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.avatar-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.avatar-letter {
  font-size: 34px;
  font-weight: 700;
  color: #ffffff;
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px; 
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-avatar-btn .material-symbols-outlined {
  font-size: 19px;  /* adjust as needed */
}

.user-info {
  text-align: center;
}

.user-info .user-name {
  font-size: 20px;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #111827;
}

.reg-no {
    margin-bottom: 0.6rem;
}

.user-info .reg-no {
  font-size: 14px;
  color: #6b7280;
}

.attendance {
  margin-top: 8px;
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 8px;
  display: inline-block;
  font-size: 14px;
}

.section h3 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #374151;
}

.input-field {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
}

.input-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #6b7280;
}

.input-field input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: #374151;
  background: transparent;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #374151;
}

.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0;
  right: 0; bottom: 0;
  background-color: #d1d5db;
  transition: 0.4s;
  border-radius: 22px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3b82f6;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.logout-btn {
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.logout-btn:hover {
  background-color: #fecaca;
}
</style>
