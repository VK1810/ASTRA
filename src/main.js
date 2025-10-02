import './assets/reset.css'
import 'material-symbols';
import 'material-symbols/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
