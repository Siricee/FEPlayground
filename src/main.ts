import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/index.scss'

import naive from '@/plugins/naive-ui'
import { router } from '@/router'

createApp(App).use(router).use(naive).mount('#app')
