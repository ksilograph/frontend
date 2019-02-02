<template lang="html">
  <div class="add-budget-box">

    <div class="my-nav">
      <div class="my-nav-content text-center">
        <router-link :to="{ name: 'home' }"><i class="fas fa-arrow-left back"></i></router-link>
        <p class="text-center">ДОБАВИТЬ БЮДЖЕТ</p>
        <i class="fas fa-check accept" v-on:click="postBudget" :class="acceptClass"></i>
      </div>
    </div>

    <div class="row category-items">

      <div class="col-md-3" v-for="(item, key) in currentCats">
        <div class="card-category text-center">
          <i class="fas fa-shopping-basket card-logo"></i><br>

          <div class="input-group">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupCategory"><i class="fas fa-book"></i></label>
            </div>
            <select class="custom-select" id="inputGroupCategory" v-model="item.cat">
              <option v-for="cat in cats" v-bind:value="cat.name" v-bind:key="cat.idCategory">{{cat.name}}</option>
            </select>
          </div>

          <div class="input-group">
            <div class="input-group-prepend pointer" title="Рекомендованный лимит" @click="setRecomendMoney(key)">
              <span class="input-group-text" id="inputGroupMoney"><i class="fas fa-ruble-sign"></i></span>
            </div>
            <input v-model="item.money" type="number" class="form-control" placeholder="Сумма" aria-label="Money" aria-describedby="inputGroupMoney">
          </div>

        </div>
      </div>

      <div class="col-md-3">
        <div class="card-category-add text-center" v-on:click="addCat">
          <i class="far fa-plus-square"></i>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'addBudget',
  data () {
    return {
      currentCats: []
    }
  },
  methods: {
    addCat () {
      let newCat = {
        cat: '',
        money: 0
      }
      this.currentCats.push(newCat)
    },
    postBudget () {
      this.$http.post(this.$apiURL + 'budget', this.formatedPost)
        .then(res => {
          this.$notify({
            group: 'foo',
            title: 'Операция выполена',
            text: 'Бюджет успешно добавлен!',
            type: 'success'
          })

          let temp = this.budgets
          temp.unshift(res.data.data)
          this.$router.push({ name: 'home' })
        })
        .catch(err => {
          this.$notify({
            group: 'foo',
            title: 'Ошибка запроса',
            text: 'Соединение с сервером потеряно!',
            position: 'bottom right',
            type: 'error'
          })

          console.error(err)
        })
    },
    setRecomendMoney (id) {
      this.currentCats[id].money = this.recomendMoney[this.cats.find( x =>  x.name === this.currentCats[id].cat).idCategory]
    }
  },
  computed: {
    cats () {
      return this.$store.getters.getCategories
    },
    budgets () {
      return this.$store.getters.getBudgets
    },
    formatedPost () {
      let post = []
      this.currentCats.forEach((item, i, arr) => {
        const temp = {
          idCategory: this.cats.find(x => x.name == item.cat).idCategory,
          money: item.money
        }
        post.push(temp)
      })
      return post
    },
    acceptClass () {
      if (this.currentCats.length < 1) {
        return {
          'accept-noactive': true
        }
      } else {
        return {
          'accept-active': true,
          'text-success': true
        }
      }
    },
    recomendMoney () {
      let temp = {}
      console.log(temp)
      this.budgets.forEach((budget, i, arr) => {
        budget.categories.forEach((category, j, arr2) => {
          if (!temp[category.category.idCategory]) {
            temp[category.category.idCategory] = {}
            temp[category.category.idCategory].spending = 0
            temp[category.category.idCategory].countMonth = 0
          }
          temp[category.category.idCategory].spending += category.spending
          temp[category.category.idCategory].countMonth++
        })
      })
      let recomend = {}
      for (let key in temp) {
        let div = temp[key].spending / temp[key].countMonth
        recomend[key] = div.toFixed(0)
      }
      return recomend
    }
  }
}
</script>

<style lang="css" scoped>

.my-nav {
  width: auto;
  /* height: 50px; */

  font-family: 'Cuprum', sans-serif;
  font-size: 2em;
  color: #bbb;

  background-color: #eee;
}

.my-nav-content .back {
  position: absolute;
  left: 25px;
  top: 8px;
}

.my-nav-content .accept {
  position: absolute;
  right: 25px;
  top: 8px;
}

.my-nav-content span {
  text-align: center;
}

.card-category-add {
  height: 180px;
  width: 100%;

  margin-bottom: 10px;

  border: 2px solid black;
  border-radius: 5%;

  font-size: 3em;
  cursor: pointer;
}

.card-category-add i {
  margin: 65px auto;
}

.card-category {
  height: 180px;
  width: 100%;

  margin-bottom: 10px;

  border: 2px solid black;
  border-radius: 5%;
}

.accept-active {
  cursor: pointer;
}

.accept-noactive {
  cursor: default;
}

.card-category input, .card-category select {
  width: 70%;
  margin: 5px 0px;
}

.card-logo {
  font-size: 3em;
  margin: 10px auto;
}

.card-category .input-group {
  width: 90%;
  margin: 10px auto;
}

.card-category .custom-select {
  margin: 0;
}

.card-category input {
  margin: 0;
}

.pointer {
  cursor: pointer;
}

</style>
