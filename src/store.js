import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    categories: [],
    budgets: []
  },
  mutations: {
    setCategories (state, payload) {
      state.categories = payload
    },
    setBudgets (state, payload) {
      state.budgets = payload
    }
  },
  getters: {
    getCategories: state => {
      return state.categories
    },
    getBudgets: state => {
      return state.budgets
    }
  },
  actions: {

  }
})
