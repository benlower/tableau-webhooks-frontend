import Vue from 'vue'
import Router from 'vue-router'
import ConfiguredWebhooks from '@/components/configuredWebhooks'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'configuredWebhooks',
      component: ConfiguredWebhooks
    }
  ]
})
