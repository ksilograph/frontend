<template lang="html">
  <div class="budget-box">

    <div class="my-nav">
      <div class="my-nav-content text-center">
        <router-link :to="{ name: 'home' }"><i class="fas fa-arrow-left"></i></router-link>
        <p class="text-center">{{ budgetsCategories.date.date.toUpperCase() }}</p>
        <i class="far fa-trash-alt" @click="deleteBudget"></i>
      </div>
    </div>
    <div class=" row category-items">
      <div class="col-md-3" v-for="category in budgetsCategories.categories">
        <div class="card-category text-center">
          <i class="fas fa-shopping-basket card-logo"></i>
          <h4>{{ category.category.name }}</h4>
          <h3 :class="{ 'text-danger': category.spending > category.money }">{{ category.spending }} <sup>/{{ category.money }}</sup>  </h3>
        </div>
      </div>
    </div>

    <div class="my-nav">
      <div class="my-nav-content text-center">
        <p class="text-center">ДИАГРАММЫ</p>
      </div>
    </div>

    <div class="row charts mb-3">
      <div class="col-md-6">
        <chart :chartData="chartData.money" :options="{}"/>
      </div>

      <div class="col-md-6">
        <chart :chartData="chartData.spending" :options="{}"/>
      </div>
    </div>

    <div class="my-nav">
      <div class="my-nav-content text-center">
        <p class="text-center">ТРАНЗАКЦИИ</p>
      </div>
    </div>

    <div class="transactions">
      <table class=table>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Категория</th>
            <th scope="col">Описание</th>
            <th scope="col">Сумма</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, key) in budgetsCategories.transactions">
            <th scope="row">{{ key + 1 }}</th>
            <td>{{ cats.find( x => x.idCategory === transaction.idCategory).name }}</td>
            <td>{{ transaction.text }}</td>
            <td>{{ transaction.spending }} руб.</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
import Chart from '../components/Chart'

export default {
  name: 'budget',
  components: { Chart },
  data () {
    return {
      transactions: []
    }
  },
  methods: {
    deleteBudget () {
      this.$http.delete(this.$apiURL + 'budget/' + this.$route.params.id)
        .then(res => {
          this.$notify({
            group: 'foo',
            title: 'Операция выполена',
            text: 'Бюджет успешно удален!',
            type: 'success'
          })

          let temp = this.$store.getters.getBudgets
          let index = temp.findIndex(x => x.idBudget == this.$route.params.id)
          temp.splice(index, 1)
          this.$store.commit('setBudgets', temp)
          this.$router.push({ name: 'home' })
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  computed: {
    budgetsCategories () {
      return this.$store.getters.getBudgets.find(x => x.idBudget == this.$route.params.id)
    },
    cats () {
      return this.$store.getters.getCategories
    },
    chartData () {
      let temp = {
        name: [],
        money: [],
        spending: []
      }
      this.budgetsCategories.categories.forEach((item, i, arr) => {
        temp.name.push(item.category.name)
        temp.money.push(item.money)
        temp.spending.push(item.spending)
      })
      let data = {
        money: {
          labels: temp.name,
          datasets: [
            {
              label: 'Лимиты',
              backgroundColor: [
                '#f3f31d',
                '#226540',
                '#a2b61a',
                '#e17ec5',
                '#3b1ab8',
                '#ddb7bc',
                '#2db2cf',
                '#da8cd0',
                '#5aa8a0',
                '#b9513b',
              ],
              data: temp.money
            }
          ]
        },
        spending: {
          labels: temp.name,
          datasets: [
            {
              label: 'Потрачено',
              backgroundColor: [
                '#f3f31d',
                '#226540',
                '#a2b61a',
                '#e17ec5',
                '#3b1ab8',
                '#ddb7bc',
                '#2db2cf',
                '#da8cd0',
                '#5aa8a0',
                '#b9513b',
              ],
              data: temp.spending
            }
          ]
        }
      }
      return data
    }
  },
  beforeMount () {

  }
}
</script>

<style lang="css" scoped>
  .card-category {
    height: 150px;
    width: 100%;

    margin-bottom: 10px;

    border: 2px solid black;
    border-radius: 5%;
  }

  .category-items {
    margin-bottom: 10px;
  }

  .card-logo {
    font-size: 3em;
    margin: 10px auto;
  }

  .my-nav {
    width: auto;
    /* height: 50px; */

    font-family: 'Cuprum', sans-serif;
    font-size: 2em;
    color: #bbb;

    background-color: #eee;
  }

  .my-nav-content .fa-arrow-left {
    position: absolute;
    left: 25px;
    top: 8px;
  }

  .my-nav-content .fa-trash-alt {
    position: absolute;
    right: 25px;
    top: 8px;

    cursor: pointer;
  }

  .my-nav-content span {
    text-align: center;
  }


</style>
