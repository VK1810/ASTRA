<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from "vue-router";

const videoRef = ref(null);
const photo = ref(null);
const lat = ref(null);
const lon = ref(null);
let stream = null;

const router = useRouter();

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
};

const startCamera = async () => {
  stopCamera();
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
    }
  } catch (err) {
    console.error("Error accessing camera:", err);
  }
};

// Fetch geolocation immediately when component mounts
const getLocation = () => {
  if (!navigator.geolocation) {
    console.error("Geolocation not supported");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      lat.value = pos.coords.latitude;
      lon.value = pos.coords.longitude;
    },
    (err) => {
      console.error("Error getting location:", err);
    }
  );
};

function capture() {
  const video = videoRef.value;
  if (!video) return;

  const size = 300;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const videoAspect = video.videoWidth / video.videoHeight;
  let sx, sy, sWidth, sHeight;

  if (videoAspect > 1) {
    sHeight = video.videoHeight;
    sWidth = sHeight;
    sx = (video.videoWidth - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = video.videoWidth;
    sHeight = sWidth;
    sx = 0;
    sy = (video.videoHeight - sHeight) / 2;
  }

  // Mirror effect
  ctx.translate(size, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, size, size);

  photo.value = canvas.toDataURL("image/png");

  stopCamera();
}

async function retake() {
  photo.value = null;
  await nextTick();
  startCamera();
  getLocation();
}

const PROTOTYPE_MODE = true; // set false to use real API

// ✅ Confirm photo = register attendance
async function confirmPhoto() {
  if (!photo.value) return;

  try {
    const storedData = localStorage.getItem("signupData");
    if (!storedData) {
      console.error("No signup data found in localStorage");
      return;
    }

    const formData = JSON.parse(storedData);
    const student_id = formData.registerNumber;

    const base64Image = photo.value.replace(/^data:image\/\w+;base64,/, "");

    const payload = {
      student_id,
      face: base64Image,
      lat: lat.value,
      lon: lon.value,
    };

    // 🟢 Prototype Mode → skip API
    if (PROTOTYPE_MODE) {
      console.log("Prototype mode active → skipping API", payload);

      // Simulate success
      alert("Attendance marked successfully ✅");
      router.push("/");

      // Or to simulate failure:
      // alert("Failed to mark attendance ❌");
      // return;
      return;
    }

    // 🚀 Real API Mode
    const res = await fetch("https://5af483c564df.ngrok-free.app/attendance/student/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json(); // expect [true, "msg"] or [false, "msg"]

    if (Array.isArray(data) && data[0] === true) {
      console.log("Attendance registered:", data[1]);
      alert(data[1] || "Attendance marked successfully ✅");
      router.push("/"); // ✅ success → go to home
    } else {
      console.warn("Attendance failed:", data[1]);
      alert(data[1] || "Failed to mark attendance ❌");
    }
  } catch (err) {
    console.error("Error confirming photo:", err);
    alert("Something went wrong ❌");
  }
}



onMounted(() => {
  startCamera();
  getLocation();
});
onBeforeUnmount(stopCamera);
</script>

<template>
  <div class="camera-wrapper">
    <div class="camera-header">
      <h2 class="title">
        <span style="font-weight: 400;">MARK </span>ATTENDANCE
      </h2>
      <p class="subtitle">
        Take a selfie and ensure your location is enabled.
      </p>
    </div>

    <div class="camera-box" :class="{ pulsing: photo }">
      <video v-if="!photo" ref="videoRef" autoplay playsinline muted></video>
      <img v-else :src="photo" alt="Your selfie" />
    </div>

    <!-- ✅ Location Display -->
<div class="location-box" v-if="lat && lon">
  <span class="location-icon">📍</span>
  <div class="location-text">
    <p><strong>Latitude:</strong> {{ lat }}</p>
    <p><strong>Longitude:</strong> {{ lon }}</p>
  </div>
</div>
<div class="location-box" v-else>
  <span class="location-icon">📍</span>
  <div class="location-text">
    <p>Fetching location...</p>
  </div>
</div>

    <div class="controls" v-if="!photo">
      <button class="btn capture-btn" @click="capture">
        Capture
      </button>
    </div>

    <div class="controls" v-else>
      <button class="btn retake-btn" @click="retake">
        Retake
      </button>
      <button class="btn confirm-btn" @click="confirmPhoto">
        Submit Attendance
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Same styles as before */
.location-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc; /* flatter neutral background */
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  color: #334155;
  text-align: left;
  width: 100%;
  max-width: 320px;
}

.location-icon {
  font-size: 20px;
  color: #ef4444; /* red for pin */
  flex-shrink: 0;
}

.location-text p {
  margin: 0;
  line-height: 1.4;
}

.camera-wrapper {
  background-color: #f7f8fc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  min-height: 100vh;
  padding: 20px;
  font-family: 'Manrope', 'Noto Sans', sans-serif;
  box-sizing: border-box;
}

.camera-header {
  text-align: center;
}

.title {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px;
}

.subtitle {
  margin: 0 auto;
  max-width: 350px;
  line-height: 1.5;
  font-size: 15px;
  color: #64748b;
}

.camera-box {
  width: 300px;
  height: 300px;
  overflow: hidden;
  border-radius: 50%;
  background: #222;
  border: 6px solid #e0e7ff;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: center;
  align-items: center;
}

.camera-box video,
.camera-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-box video {
  transform: scaleX(-1);
}

/* 🔥 Pulse effect only when photo is captured */
.camera-box.pulsing {
  animation: pulse-border 3s infinite; /* slower pulse */
}

@keyframes pulse-border {
  0% {
    border-color: #e0e7ff;
    box-shadow: 0 0 0 0 rgba(224, 231, 255, 0.7);
  }
  50% {
    border-color: #e0e7ff;
    box-shadow: 0 0 0 18px rgba(224, 231, 255, 0);
  }
  100% {
    border-color: #e0e7ff;
    box-shadow: 0 0 0 0 rgba(224, 231, 255, 0.7);
  }
}


.controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
  max-width: 350px;
}

.btn {
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  padding: 14px 24px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  flex-grow: 1;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.capture-btn,
.confirm-btn {
  background-color: #4f46e5;
  color: #ffffff;
}

.capture-btn:hover,
.confirm-btn:hover {
  background-color: #4338ca;
}

.retake-btn {
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.retake-btn:hover {
  background-color: #f8fafc;
  border-color: #94a3b8;
}
</style>
