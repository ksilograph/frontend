<template lang="html">
  <div id="app">

    <notifications group="foo" position="bottom right" />
    <div class="loader" v-if="showLoader">
      <div class="spinner-grow" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div class="header bg-info text-center">
      <router-link :to="{ name: 'home', params: {} }" class="logo">MoneyManager</router-link>
    </div>

      <div class="container mt-5">
        <div class="row">
          <div class="col-md-3">

            <div class="card">
              <img class="card-img-top user-img" src="./assets/user.jpg" alt="Card image cap">
              <div class="card-body">
                <h4 class="card-title text-center">{{ userInfo.name }}</h4>
              </div>
            </div>

            <div class="card new-transaction-card mt-3">
              <div class="card-header font-weight-bold" @click="newTransactionShow = !newTransactionShow">
                Новая транзакция
              </div>
              <div class="card-body text-center" v-if="newTransactionShow">

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01"><i class="fas fa-book"></i></label>
                  </div>
                  <select class="custom-select" id="inputGroupSelect01" v-model="selectedCat">
                    <option v-for="cat in cats" v-bind:value="cat.name" v-bind:key="cat.id">{{cat.name}}</option>
                  </select>
                </div>

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1"><i class="fas fa-ruble-sign"></i></span>
                  </div>
                  <input v-model="newTransaction.money" type="number" class="form-control" placeholder="Сумма" aria-label="Сумма" aria-describedby="basic-addon1">
                </div>

                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon2"><i class="fas fa-pencil-alt"></i></span>
                  </div>
                  <input v-model="newTransaction.text" type="text" class="form-control" placeholder="Описание" aria-label="Описание" aria-describedby="basic-addon2">
                </div>

                <button type="button" class="btn btn-success" v-on:click="postTransactions">Сохранить</button>

              </div>
            </div>

            <div class="card category-card mt-3 mb-4">
              <div class="card-header font-weight-bold" @click="categoryShow = !categoryShow" style="cursor: pointer">
                Категории
              </div>
              <ul class="list-group list-group-flush" v-if="categoryShow">
                <li class="list-group-item" v-for="cat in cats">
                  <span>{{cat.name}}</span>
                  <i class="far fa-trash-alt category-icons" @click="deleteCat(cat.idCategory)"></i>
                  <!-- <i class="far fa-edit category-icons" @click="deleteCat(cat.idCategory)"></i> -->
                </li>
                <li class="list-group-item">
                  <div class="input-group">
                    <input v-model="newCat" type="text" class="form-control" placeholder="Новая категория" aria-label="Новая категория" >
                    <div class="input-group-append">
                      <button v-bind:disabled="newCat.length < 1" @click="addCat" class="btn btn-outline-secondary" type="button" id="button-addon2"><i class="fas fa-plus text-success"></i></button>
                    </div>
                  </div>

                </li>
              </ul>
            </div>

          </div>
          <div class="col-md-9">
            <router-view/>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
export default {
  data: function () {
    return {
      selectedCat: '',
      newCat: '',
      userInfo: {},
      newTransaction: {},
      categoryShow: false,
      newTransactionShow: false,
      loadingFlags: {
        user: true,
        budget: true,
        cats: true
      }
    }
  },
  methods: {
    getCat () {
      this.$http.get(this.$apiURL + 'category')
        .then(res => {
          this.loadingFlags.cats = false

          if (JSON.stringify(res.data.data) != JSON.stringify(this.cats)) {
            this.$store.commit('setCategories', res.data.data)
            console.log('Обновили категории')
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    addCat () {
      this.$http.post(this.$apiURL + 'category', {
        name: this.newCat
      })
        .then(res => {
          let newCats = this.cats
          newCats.push(res.data.data)

          this.$store.commit('setCategories', newCats)

          this.$notify({
            group: 'foo',
            title: 'Операция выполена',
            text: 'Категория ' + this.newCat + ' успешно добавлена!',
            type: 'success'
          })

          this.newCat = ''
        })
        .catch(err => {
          this.$notify({
            group: 'foo',
            title: 'Ошибка запроса',
            text: 'Соединение с сервером потеряно!',
            type: 'error'
          })

          console.error(err)
        })
    },
    getUserInfo () {
      this.$http.get(this.$apiURL + 'user')
        .then(res => {
          this.loadingFlags.user = false
          console.log(res.data)
          this.userInfo = res.data.data
        })
        .catch(err => {
          console.error(err)
        })
    },
    postTransactions () {
      this.$http.post(this.$apiURL + 'transaction', {
        idCategory: this.cats.find(x => x.name === this.selectedCat).idCategory,
        spending: this.newTransaction.money,
        text: this.newTransaction.text,
        idBudget: this.budgets[0].idBudget
      })
        .then(res => {
          this.$notify({
            group: 'foo',
            title: 'Операция выполена',
            text: 'Транзакция ' + this.newTransaction.text + ' успешно добавлена!',
            type: 'success'
          })

          this.selectedCat = ''
          this.newTransaction = {}
          this.newTransactionShow = false
          let temp = this.budgets
          temp[0].transactions.push(res.data.data)
          temp[0].categories.find(x => x.category.idCategory == res.data.data.idCategory).spending += res.data.data.spending
          this.$store.commit('setBudgets', temp)
        })
        .catch(err => {
          this.$notify({
            group: 'foo',
            title: 'Ошибка запроса',
            text: 'Соединение с сервером потеряно!',
            type: 'error'
          })

          console.error(err)
        })
    },
    getBudget () {
      this.$http.get(this.$apiURL + 'budget')
        .then(res => {
          this.loadingFlags.budget = false

          const sortedRes = res.data.data.sort((a, b) => {
            if (a.date.numberOfMonth < b.date.numberOfMonth) {
              return 1
            } else {
              return -1
            }
          })

          if (JSON.stringify(sortedRes) != JSON.stringify(this.budgets)) {
            this.$store.commit('setBudgets', sortedRes)
            console.log('Обновили бюджеты')
          }
        })
        .catch(err => {
          this.$notify({
            group: 'foo',
            title: 'Ошибка запроса',
            text: 'Соединение с сервером потеряно!',
            type: 'error'
          })

          console.error(err)
        })
    },
    deleteCat (id) {
      this.$http.delete(this.$apiURL + 'category/' + id)
        .then(res => {
          this.$notify({
            group: 'foo',
            title: 'Операция выполена',
            text: 'Категория успешно удалена!',
            type: 'success'
          })

          let temp = this.cats
          let index = temp.findIndex(x => x.idCategory === id)
          temp.splice(index, 1)
          this.$store.commit('setCategories', temp)
        })
        .catch(err => {
          this.$notify({
            group: 'foo',
            title: 'Ошибка запроса',
            text: 'Соединение с сервером потеряно!',
            type: 'error'
          })

          console.error(err)
        })
    }
  },
  computed: {
    cats () {
      return this.$store.getters.getCategories
    },
    budgets () {
      return this.$store.getters.getBudgets
    },
    showLoader () {
      return (this.loadingFlags.user && this.loadingFlags.budget & this.loadingFlags.cats)
    }
  },
  beforeMount () {
    this.getCat()
    this.getUserInfo()
    this.getBudget()
  },
  created () {
    setInterval(() => {
      this.getCat()
      this.getBudget()
    }, 2000)
  }
}
</script>

<style lang="css" scoped>
  .header {
    width: 100%;
    height: 50px;

    font-family: 'Baloo Thambi', cursive;
  }

  .logo {
    font-size: 2em;
    color: white;
    text-decoration: none;
  }

  .user-img {
    margin: 10px auto;
    border-radius: 50%;
    width: 50%;
  }

  .new-transaction-card .card-header {
    cursor: pointer;
  }

  .category-icons {
    cursor: pointer;
    float: right;
    margin: 0 3px;
  }

  .loader {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    overflow: visible;
    background-color: white;
  }

  .loader .spinner-grow {
    position: absolute;
    display: block;
    left: 50%;
    top: 50%;
  }

</style>
