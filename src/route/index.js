// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }
  verfyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }
  static getList = () => this.#list

  static getById = (id) => {
    this.#list.find((user) => user.id === id)
  }
  static getDeleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static getUpdateById = (id, data) => {
    const user = this.getById(id)
    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }
  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}
class Product {
  static #list = []
  constructor(id, createDate, name, price, description) {
    this.id = id
    this.createDate = createDate
    this.name = name
    this.price = price
    this.description = description
  }
  static getList = () => this.#list
  static add = (product) => {
    this.#list.push(product)
  }
  static getById = (id) => {
    this.#list.find((product) => product.id === id)
  }
  static getUpdateById = (id, data) => {
    const product = this.getById(id)
    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }
  static update = (
    product,
    { name },
    { price },
    { description },
  ) => {
    if (name) {
      product.name = name
    }
    if (price) {
      product.price = price
    }
    if (description) {
      product.description = description
    }
  }
  static getDeleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })

  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body
  const user = new User(email, login, password)
  User.add(user)
  console.log(User.getList())
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'success-info',
    info: 'Користувач створенний',
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.get('/user-delete', function (req, res) {
  const { id } = req.query
  console.log(id)
  User.getDeleteById(Number(id))

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'success-info',
    info: 'Користувача видалено',
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body
  let result = false
  const user = User.getById(Number(id))

  if (user.verfyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'success-info',
    info: result ? 'Email оновлено' : 'Сталась помилка',
  })
  // ↑↑ сюди вводимо JSON дані
})
//==================================================================
router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })

  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.post('/product-create', function (req, res) {
  const { name, price, description, id } = req.body
  const product = new Product(name, price, description, id)
  Product.add(product)
  console.log(Product.getList())
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    info: 'Успішно створенний',
  })
  // ↑↑ сюди вводимо JSON дані
})
//================================================================
router.get('/product-list', function (req, res) {
  let list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
//==================================================
router.get('/product-edit', function (req, res) {
  const { id } = req.query
  console.log(id)
  const product = Product.getById(Number(id))
  let result = false
  if (product) {
    result = true
  }

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    info: result ? 'Данні оновлено' : 'Сталась помилка',
  })
  // ↑↑ сюди вводимо JSON дані
})
//==================================================
router.post('/product-edit', function (req, res) {
  const { name, description, id, price } = req.body
  let result = false
  const product = Product.getById(Number(id))

  if (product.id) {
    Product.update(product, {
      name,
      description,
      price,
    })
    result = true
  }

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    info: result ? 'Данні оновлено' : 'Сталась помилка',
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.get('/product-delete', function (req, res) {
  const { id } = req.query
  console.log(id)
  Product.getDeleteById(Number(id))

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    info: 'Товар видалено',
  })
  // ↑↑ сюди вводимо JSON дані
})
// Підключаємо роутер до бек-енду
module.exports = router
