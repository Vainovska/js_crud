// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Purches {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1
  static #list = []
  static #count = 0
  static #bonusAccount = new Map()
  static getBonusBalance = (email) => {
    return Purches.#bonusAccount.get(email) || 0
  }
  static calcBonusAmount = (value) => {
    return value * Purches.#BONUS_FACTOR
  }
  static updateBonusBalanse = (
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purches.getBonusBalance(email)
    const updateBalance = currentBalance + amount - bonusUse
    Purches.#bonusAccount.set(email, updateBalance)
    console.log(email, updateBalance)
    return amount
  }
  constructor(data, product) {
    this.id = ++Purches.#count
    this.firstname = data.firstname
    this.lastname = data.lastname
    this.phone = data.phone
    this.email = data.email
    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null
    this.amount = data.amount
    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.product = product
  }
  static add = (...arg) => {
    const newPurchase = new Purches(...arg)
    this.#list.push(newPurchase)
    return newPurchase
  }
  static getList = () => {
    return Purches.#list.reverse()
  }
  static getById = (id) => {
    return Purches.#list.find((item) => item.id === id)
  }
  static updateById = (id, data) => {
    const purchase = Purches.getById(id)
    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email
      return true
    } else {
      return false
    }
  }
}
class Product {
  static #list = []
  static #count = 0
  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }
  static getList = () => {
    return this.#list
  }
  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }
  static getRandomList = (id) => {
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )
    const shuffedList = filteredList.sort(
      () => Math.random() - 0.5,
    )
    return shuffedList.slice(0, 3)
  }

  // // ================================================================
  // // router.get Створює нам один ентпоїнт
}
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 Gb`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 Gb`,
  [{ id: 1, text: 'Готовий до відправки' }],
  57000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 Gb`,
  [{ id: 2, text: 'Топ продажів' }],
  47000,
  10,
)
Product.add(
  'https://picsum.photos/200/300',
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600`,
  `AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 Gb`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  37000,
  10,
)
class Promocode {
  static #list = []
  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }
  static add = (name, factor) => {
    const newPromocode = new Promocode(name, factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }
  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }
  static calc = (promo, price) => {
    return price * promo.factor
  }
}
Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

// // ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-index',
    data: { list: Product.getList() },
  })

  //   // ↑↑ сюди вводимо JSON дані
})
// ==================================================================
router.get('/purchase-product', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-product', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })

  //   // ↑↑ сюди вводимо JSON дані
})
//================================================================
router.post('/purchase-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)
  if (amount < 1) {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      data: {
        message: 'Виникла помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }
  const product = Product.getById(id)
  if (product.amount < 1) {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      data: {
        message: 'Виникла помилка',
        info: 'Такої кількості товару немає внаявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }
  console.log(product, amount)
  const productPrice = product.price * amount
  const totalPrice = productPrice + Purches.DELIVERY_PRICE
  const bonus = Purches.calcBonusAmount(totalPrice)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-create',
    data: {
      id: product.id,
      card: [
        {
          text: `${product.title} (${amount} шт)`,
          price: productPrice,
        },
        {
          text: 'Доставка',
          price: Purches.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purches.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })

  //   // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.post('/purchase-sumbit', function (req, res) {
  // res.render генерує нам HTML сторінку
  const id = Number(req.query.id)
  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,
    firstname,
    lastname,
    email,
    phone,
    promocode,
    bonus,
    comment,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: '/purchase-list',
      },
    })
  }
  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товару немає в потрібної кількості',
        link: '/purchase-list',
      },
    })
  }
  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)
  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: '/purchase-list',
      },
    })
  }
  if (!firstname || !lastname || !phone || !email) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: `Заповніть обов'язкові поля`,
        info: 'Товар не знайдено',
        link: '/purchase-list',
      },
    })
  }
  if (bonus || bonus > 0) {
    const bonusAmount = Purches.getBonusBalance(email)
    console.log(bonusAmount)
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }
    Purches.updateBonusBalanse(email, totalPrice, bonus)
    totalPrice -= bonus
  } else {
    Purches.updateBonusBalanse(email, totalPrice, 0)
  }
  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }
  if (totalPrice < 0) totalPrice = 0
  const purchase = Purches.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      firstname,
      lastname,
      email,
      phone,
      promocode,
      bonus,
      comment,
    },
    product,
  )
  console.log(purchase)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: '/purchase-list',
    },
  })

  //   // ↑↑ сюди вводимо JSON дані
})
//=================================================================
router.get('/purchase-list', function (req, res) {
  let list = Purches.getList()
  console.log(list)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('purchase-list', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'purchase-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})
//=================================================================
router.get('/purchase-edit', function (req, res) {
  const { id } = req.query
  const purchase = Purches.getById(Number(id))
  console.log(purchase)
  if (purchase) {
    res.render('purchase-edit', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'purchase-edit',
      data: {
        totalPrice: purchase.totalPrice,
        productPrice: purchase.productPrice,
        deliveryPrice: purchase.deliveryPrice,
        amount: purchase.amount,
        id: purchase.id,
        firstname: purchase.firstname,
        lastname: purchase.lastname,
        email: purchase.email,
        phone: purchase.phone,
        promocode: purchase.promocode,
        bonus: purchase.bonus,
        comment: purchase.comment,
        product: purchase.product,
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Сталась помилка',
        link: '/purchase-list',
        info: 'Замовлення з таким ID не знайденно',
      },
    })
  }

  // ↙️ cюди вводимо назву файлу з сontainer

  // ↑↑ сюди вводимо JSON дані
})
//=================================================================
router.post('/purchase-update', function (req, res) {
  const { id, firstname, lastname, email, phone } = req.body
  const purchase = Purches.updateById(Number(id), {
    firstname,
    lastname,
    phone,
    email,
  })
  console.log(id)
  console.log(purchase)
  if (purchase) {
    res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      data: {
        message: 'Успішне виконання дії',
        link: '/purchase-list',
        info: 'Замовлення успішно було створено',
      },
    })
  } else {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Сталась помилка',
        link: '/purchase-list',
        info: 'Замовлення не створено',
      },
    })
  }

  // ↙️ cюди вводимо назву файлу з сontainer

  // ↑↑ сюди вводимо JSON дані
})
//=================================================================
// Підключаємо роутер до бек-енду
module.exports = router
