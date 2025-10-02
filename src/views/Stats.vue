<template>
  <div class="statistics-container">
    <div class="filters">
      <div class="filter-item">
        <label>Subject</label>
        <select v-model="selectedSubject">
          <option value="All">All Subjects</option>
          <option
            v-for="subject in subjects"
            :key="subject"
            :value="subject"
          >
            {{ subject }}
          </option>
        </select>
      </div>
      <div class="filter-item">
        <label>Gender</label>
        <select v-model="selectedGender">
          <option value="All">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div class="filter-item">
        <label>Date Range</label>
        <input type="date" v-model="startDate" style="  margin-right: 1rem;"/>
        <input type="date" v-model="endDate" />
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts">
      <!-- Multi-Line Chart -->
      <div class="chart-card">
        <h2>Attendance Trend by Subject</h2>
        <LineChart :data="multiLineData" :options="multiLineOptions" />
      </div>

      <!-- Stacked Bar -->
      <div class="chart-card">
        <h2>Attendance by Gender & Day</h2>
        <BarChart :data="genderDayData" :options="genderDayOptions" />
      </div>

      <!-- Radar -->
      <div class="chart-card bot-pad">
        <h2>Subject Comparison by Gender</h2>
        <RadarChart :data="radarData" :options="radarOptions" />
      </div>
    </div>
  </div>
    <NavComp/>

</template>

<script setup>
import NavComp from "../components/nav.vue"
import { ref, computed } from "vue"
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  LineElement, PointElement, LinearScale, CategoryScale,
  BarElement, ArcElement, RadialLinearScale
} from "chart.js"
import {
  Line as LineChart,
  Bar as BarChart,
  Radar as RadarChart
} from "vue-chartjs"

ChartJS.register(
  Title, Tooltip, Legend,
  LineElement, PointElement, LinearScale, CategoryScale,
  BarElement, ArcElement, RadialLinearScale
)

// Filters
const subjects = ["Physics", "Chemistry", "Maths", "History", "Music"]
const selectedSubject = ref("All")
const selectedGender = ref("All")
const startDate = ref("2025-09-01")
const endDate = ref("2025-09-15")

// Dummy Data
const rawTrends = {
  Physics: [20, 22, 25, 18, 19],
  Chemistry: [18, 20, 22, 25, 21],
  Maths: [25, 28, 22, 30, 27],
  History: [15, 18, 20, 17, 19],
  Music: [22, 24, 23, 26, 28]
}
const trendLabels = ["Sep 10", "Sep 11", "Sep 12", "Sep 15", "Sep 16"]

// Multi-Line Chart
const multiLineData = computed(() => {
  const datasets = subjects
    .filter(sub => selectedSubject.value === "All" || sub === selectedSubject.value)
    .map(sub => ({
      label: sub,
      data: rawTrends[sub],
      borderColor: colors[sub],
      backgroundColor: colors[sub] + "33",
      tension: 0.3
    }))
  return { labels: trendLabels, datasets }
})
const multiLineOptions = { responsive: true, plugins: { legend: { position: "bottom" } } }

// Stacked Bar (Gender × Day)
const genderDayData = computed(() => ({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    {
      label: "Male",
      data: [20, 25, 22, 18, 24],
      backgroundColor: "#3b82f6"
    },
    {
      label: "Female",
      data: [18, 22, 20, 25, 19],
      backgroundColor: "#ec4899"
    }
  ].filter(ds => selectedGender.value === "All" || ds.label === selectedGender.value)
}))
const genderDayOptions = {
  responsive: true,
  plugins: { legend: { position: "bottom" } },
  scales: { x: { stacked: true }, y: { stacked: true } }
}

const timeDayOptions = {
  responsive: true,
  scales: {
    x: { title: { display: true, text: "Hour of Day" }, min: 8, max: 18, ticks: { stepSize: 1 } },
    y: {
      title: { display: true, text: "Day of Week" },
      ticks: { callback: v => ["Mon","Tue","Wed","Thu","Fri"][v-1] }
    }
  }
}

// Radar (Subject × Gender)
const radarData = computed(() => ({
  labels: subjects,
  datasets: [
    {
      label: "Male",
      data: [80, 75, 85, 70, 90],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.2)"
    },
    {
      label: "Female",
      data: [85, 80, 78, 82, 88],
      borderColor: "#ec4899",
      backgroundColor: "rgba(236,72,153,0.2)"
    }
  ].filter(ds => selectedGender.value === "All" || ds.label === selectedGender.value)
}))
const radarOptions = { responsive: true, plugins: { legend: { position: "top" } } }

// Color palette
const colors = {
  Physics: "#3b82f6",
  Chemistry: "#f59e0b",
  Maths: "#10b981",
  History: "#ef4444",
  Music: "#8b5cf6"
}
</script>

<style scoped>
.statistics-container {
  padding: 1rem;
  font-family: Manrope, "Noto Sans", sans-serif;
  background: #fff;
  color: #111827;
}

.statistics-header h1 {
  font-size: 24px;
  margin: 0;
  font-weight: 600;
}

.statistics-header p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* Filters */
.filters {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.filter-item label {
  display: block;
  font-size: 14px;
  margin-bottom: 0.3rem;
  color: #374151;
  font-weight: 500;
}

.filter-item select,
.filter-item input {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #fff;
  color: #111827;
  font-size: 14px;
}

/* Charts */
.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1rem;
}

.chart-card h2 {
  font-size: 16px;
  margin-bottom: 0.8rem;
  font-weight: 600;
}

.bot-pad {
  margin-bottom: 6rem;
}
</style>
