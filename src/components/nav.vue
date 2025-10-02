<template>
  <footer class="footer">
    <nav class="navigation">
      <button
        v-for="navItem in navigationItems"
        :key="navItem.name"
        type="button"
        :class="['nav-item', navItem.active ? 'nav-item--active' : '']"
        @click="navigateTo(navItem)"
      >
        <span
          :class="['material-symbols-outlined', !navItem.active && 'nav-icon--outlined']"
        >
          {{ navItem.icon }}
        </span>
        <p class="nav-label">{{ navItem.name }}</p>
      </button>
    </nav>
  </footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()

// Define navigation items
const navigationItems = ref([
  { name: 'Home', icon: 'home', route: '/' },
  { name: 'OD/ML', icon: 'calendar_month', route: '/odml' },
  { name: 'Stats', icon: 'bar_chart', route: '/stats' },
  { name: 'Profile', icon: 'person', route: '/profile' }
])

// Keep active state in sync with current route
const updateActive = () => {
  navigationItems.value.forEach(item => {
    item.active = route.path === item.route
  })
}

// Initial sync
updateActive()

// Watch for route changes (back/forward buttons, programmatic navigation, etc.)
watch(() => route.path, () => {
  updateActive()
})

const navigateTo = (navItem) => {
  if (route.path !== navItem.route) {
    router.push(navItem.route)
  }
  updateActive()
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.nav-icon--outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.footer {
  font-family: Manrope, "Noto Sans", sans-serif;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: white;
  border-top: 1px solid #e5e7eb;
  z-index: 10;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.navigation {
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  width: 25%;
  text-decoration: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px 0;
  background: none;
  border: none;
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
}

.nav-item--active .nav-label {
  font-weight: 700;
}

.nav-item--active {
  color: #4f46e5;
}
</style>
