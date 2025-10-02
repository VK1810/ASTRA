import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Signin from '../views/Signin.vue'
import Camera from '../views/Camera.vue'
import Profile from '../views/Profile.vue'
import Faculty from '../views/Faculty.vue'
import Attendance from '../views/Attendance.vue'
import Stats from '../views/Stats.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats,
    },
    {
      path: '/attendance',
      name: 'attendance',
      component: Attendance,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/camera',
      name: 'camera',
      component: Camera,
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin,
    },
    {
      path: '/faculty',
      name: 'faculty',
      component: Faculty,
    },
  ],
})

export default router
