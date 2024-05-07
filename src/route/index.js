// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
//================================================================
class Track {
  static #list = []
  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) //генерується випадкове id
    this.name = name
    this.author = author
    this.image = image
  }
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }
  static getList() {
    return this.#list.reverse()
  }
}
Track.create(
  'Інь Ян',
  'MONATIC & ROXOLANA',
  'https://picsum.photos/100/100',
)
Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomez & Rauw Alejandro',
  'https://picsum.photos/100/100',
)
Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/100/100',
)
Track.create(
  'the night',
  'champion',
  'https://picsum.photos/100/100',
)
Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomez & Rauw Alejandro',
  'https://picsum.photos/100/100',
)
Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/100/100',
)
Track.create(
  'the night',
  'champion',
  'https://picsum.photos/100/100',
)
console.log(Track.getList())
class PlayList {
  static #list = []
  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }
  static create(name) {
    const newPlayList = new PlayList(name)
    this.#list.push(newPlayList)
    return newPlayList
  }
  static getList() {
    return this.#list.reverse()
  }
  static makeMix(playlist) {
    const allTracks = Track.getList()
    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    playlist.tracks.push(...randomTracks)
  }
  static getById(id) {
    return (
      PlayList.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }
  deleteTrackById(trackID) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackID,
    )
  }
  addTrackById(trackID) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackID,
    )
  }
  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}
PlayList.makeMix(PlayList.create('Test'))
PlayList.makeMix(PlayList.create('Test2'))
PlayList.makeMix(PlayList.create('Test3'))
// ================================================================
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const value = ''
  const list = PlayList.findListByValue(value)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spoty-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spoty-index',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })

  // ↑↑ сюди вводимо JSON дані
})
router.get('/spoty-chose', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spoty-chose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spoty-chose',
    data: {},
  })

  // ↑↑ сюди вводимо JSON дані
})
router.get('/spoty-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const isMix = !!req.query.isMix
  console.log(isMix)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spoty-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spoty-create',
    data: {
      isMix,
    },
  })

  // ↑↑ сюди вводимо JSON дані
})
router.post('/spoty-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const isMix = !!req.query.isMix
  const name = req.body.name
  if (!name) {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Введіть назву плейлиста',
        link: isMix
          ? '/spoty-create?isMix=true'
          : '/spoty-create',
      },
    })
  }
  const playlist = PlayList.create(name)
  if (isMix) {
    PlayList.makeMix(playlist)
  }
  console.log(playlist)
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spoty-playlist', {
    style: 'spoty-playlist',
    data: {
      plalistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })

  // ↑↑ сюди вводимо JSON дані
})
router.get('/spoty-playlist', function (req, res) {
  const id = Number(req.query.id)
  const playlist = PlayList.getById(id)
  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейліста не знайдено',
        link: '/',
      },
    })
  }
  res.render('spoty-playlist', {
    style: 'spoty-playlist',
    data: {
      plalistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
router.get('/spoty-playlist-add', function (req, res) {
  const id = Number(req.query.plalistId)
  const playlist = Track.getList()

  res.render('spoty-playlist-add', {
    style: 'spoty-playlist-add',
    data: {
      plalistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('spoty-track-delete', function (req, res) {
  const plalistId = Number(req.query.plalistId)
  const trackID = Number(req.query.trackID)
  const playlist = PlayList.getById(plalistId)

  playlist.deleteTrackById(trackID)
  res.render('spoty-playlist', {
    style: 'spoty-playlist',
    data: {
      plalistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
router.get('spoty-track-add', function (req, res) {
  const plalistId = Number(req.query.plalistId)
  const trackID = Number(req.query.trackID)
  const playlist = PlayList.getById(plalistId)

  playlist.addTrackById(trackID)
  res.render('spoty-playlist', {
    style: 'spoty-playlist',
    data: {
      plalistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
router.get('/spoty-search', function (req, res) {
  const value = ''
  const list = PlayList.findListByValue(value)
  res.render('spoty-search', {
    style: 'spoty-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
router.post('/spoty-search', function (req, res) {
  const value = req.body.value || ''
  const list = PlayList.findListByValue(value)
  console.log(value)
  res.render('spoty-search', {
    style: 'spoty-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

//=================================================================
// Підключаємо роутер до бек-енду
module.exports = router
