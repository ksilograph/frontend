<template lang="html">
  <div class="budgets-box">
    <router-link :to="{ name: 'addBudget' }">
      <button type="button" class="btn btn-info btn-lg btn-block budget-link"><i class="fas fa-plus-circle" style=""></i></button>
    </router-link>
    <div class="budgets" v-for="item in budgets">
      <router-link :to="{ name: 'budget', params: { id: item.idBudget } }">
        <button type="button" class="btn btn-primary btn-lg btn-block budget-link">{{ item.date.date.toUpperCase() }}</button>
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  data () {
    return {

    }
  },
  methods: {

  },
  computed: {
    cats () {
      return this.$store.getters.getCategories
    },
    budgets () {
      return this.$store.getters.getBudgets
    }
  },
  beforeMount () {

  }
}
</script>

<style lang="css" scoped>
  .budget-link {
    margin: 10px 0;
    /* height: 30px; */
  }
</style>
