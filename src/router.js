import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Budget from './views/Budget.vue'
import AddBudget from './views/AddBudget.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/:id',
      name: 'budget',
      component: Budget
    },
    {
      path: '/addBudget',
      name: 'addBudget',
      component: AddBudget
    }
  ]
})
