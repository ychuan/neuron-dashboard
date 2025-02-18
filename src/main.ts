import { createApp } from 'vue'
import EmqxUI from '@emqx/emqx-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

import '@emqx/emqx-ui/lib/styles/index.scss'
import '@/styles/emqx-ui-variables.scss'
import '@/styles/base.scss'
import '@/styles/reset.scss'
import '@/styles/colors.scss'
import '@/styles/common.scss'
import '@/assets/fonts/iconfont.css'
import '@/assets/fonts/iconfont'
import '@/styles/kuiper.scss'

createApp(App).use(i18n).use(EmqxUI).use(store).use(router).mount('#neuron-dashboard')
