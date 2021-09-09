const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const users = JSON.parse(localStorage.getItem('favoriteUsers')) || []
const dataPanel = document.querySelector('#data-panel')
const form = document.querySelector("#form")
const searchInput = document.querySelector('#search-input')
const reload = document.querySelector("#reload")
const Fav = document.querySelector("#Fav")
const USERS_PER_PAGE = 12
const paginator = document.querySelector('#paginator')

function renderUserList(data) {
  let rawHTML = ''

  data.forEach((item) => {
    rawHTML += `<div class="card col-2">
      <button class="btn" data-bs-toggle="modal" data-bs-target="#user-modal"  data-id="${item.id}">
        <img src="${item.avatar}" class="card-img-top" alt="...">
      </button>
      <div class="card-body row">
        <p class="card-title col-10">${item.name}</p>
       <button id="deleteFromFavorite" type="button" class="btn btn-danger col-2" data-id="${item.id}">x</button>
      </div>
    </div>`
  });
  dataPanel.innerHTML = rawHTML
}

function showUserModal(id) {
  const modalId = document.querySelector('#id')
  const modalName = document.querySelector('#name')
  const modalSurName = document.querySelector('#surname')
  const modalEmail = document.querySelector('#email')
  const modalGender = document.querySelector('#gender')
  const modalAge = document.querySelector('#age')
  const modalRegion = document.querySelector('#region')
  const modalBirthday = document.querySelector('#birthday')
  const modalAvatarImg = document.querySelector('#avatar-img')

  axios
    .get(INDEX_URL + "/" + id)
    .then(response => {
      const data = response.data
      console.log(response.data)
      modalId.innerText = data.id
      modalName.innerText = data.name
      modalSurName.innerText = data.surname
      modalEmail.innerText = data.email
      modalGender.innerText = data.gender
      modalAge.innerText = data.age
      modalRegion.innerText = data.region
      modalBirthday.innerText = data.birthday
      modalAvatarImg.innerText = data.avatar
    })
}


// 人物資料(對話框)
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn')) {
    const userId = event.target.dataset.id
    showUserModal(userId)
  }
})



//----------監聽選單---------------


//年齡
form.addEventListener("change", function formClicked(event) {
  if (event.target.matches("#ageChange")) {
    ageChanged()
  }
})

function ageChanged() {
  const ageChange = document.querySelector("#ageChange")
  let newForm = []

  if (Number(ageChange.value) !== 0) {
    for (const user of users) {
      if (parseInt(Number(user.age) / 10) === Number(ageChange.value)) {
        console.log(parseInt(Number(user.age) / 10))
        console.log(Number(ageChange.value))
        newForm.push(user)
      }
    }
    localStorage.setItem("FavNEW", JSON.stringify(newForm))
    renderPaginator(newForm.length)
    renderUserList(getUsersByPage(newForm, 1))
  }
}

//性別

form.addEventListener("change", function formClicked(event) {
  if (event.target.matches("#genderChange")) {
    genderChanged()
  }
})


function genderChanged() {
  const genderChange = document.querySelector("#genderChange")

  let newForm = []

  const textOfGender = genderChange.options[genderChange.value].text


  if (Number(genderChange.value) !== 0) {
    for (const user of users) {
      if (user.gender === textOfGender) {
        newForm.push(user)
      }
    }
    localStorage.setItem("FavNEW", JSON.stringify(newForm))
    renderPaginator(newForm.length)
    renderUserList(getUsersByPage(newForm, 1))
  }
}

//星座

form.addEventListener("change", function formClicked(event) {
  if (event.target.matches("#constellations")) {
    constellationChanged()
  }
})

function constellationChanged() {
  const constellations = document.querySelector("#constellations")

  const textOfConstellations = constellations.options[constellations.value].text

  let newForm = []
  if (Number(constellations.value) !== 0) {
    for (const user of users) {
      if (getConstellations(user.birthday) === textOfConstellations) {
        newForm.push(user)
      }
    }
    localStorage.setItem("FavNEW", JSON.stringify(newForm))
    renderPaginator(newForm.length)
    renderUserList(getUsersByPage(newForm, 1))
  }
}


//生日轉星座
function getConstellations(birthday) {
  let day = birthday.split('-')
  day = Number(day[1] + day[2].padStart(2, '0'))
  if (day >= 120 && day <= 218) {
    return 'Aquarius'
  } else if (day >= 219 && day <= 320) {
    return 'Pisces'
  } else if (day >= 321 && day <= 419) {
    return 'Aries'
  } else if (day >= 420 && day <= 520) {
    return 'Taurus'
  } else if (day >= 521 && day <= 621) {
    return 'Gemini'
  } else if (day >= 622 && day <= 722) {
    return 'Cancer'
  } else if (day >= 723 && day <= 822) {
    return 'Leo'
  } else if (day >= 823 && day <= 922) {
    return 'Virgo'
  } else if (day >= 923 && day <= 1023) {
    return 'Libra'
  } else if (day >= 1024 && day <= 1122) {
    return 'Scorpio'
  } else if (day >= 1123 && day <= 1221) {
    return 'Sagittarius'
  } else if (day >= 1222 || day <= 119) {
    return 'Capricorn'
  }
}

//監聽Search bar


searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  let newForm = []

  if (!keyword.length) {
    return alert('Please enter a valid string')
  }

  for (const user of users) {
    if (user.name.toLowerCase().includes(keyword)) {
      newForm.push(user)
    }
  }
  localStorage.setItem("FavNEW", JSON.stringify(newForm))
  renderPaginator(newForm.length)
  renderUserList(getUsersByPage(newForm, 1))
})


//頁面移動
reload.addEventListener("click", e => {
  window.location = 'http://127.0.0.1:5500/%E7%A4%BE%E7%BE%A4/index.html'
})

Fav.addEventListener("click", e => {
  location.reload()
})

//分頁(一頁只有8個)
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)

  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += ` <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li> `
  }

  paginator.innerHTML = rawHTML

}

function getUsersByPage(form, page) {

  const startIndex = (page - 1) * USERS_PER_PAGE

  return form.slice(startIndex, startIndex + USERS_PER_PAGE)
}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return
  const dataPages = Number(event.target.dataset.page)
  const filterData = JSON.parse(localStorage.getItem("FavNEW"))
  renderUserList(getUsersByPage(filterData, dataPages))
}
)

renderPaginator(users.length)
renderUserList(getUsersByPage(users, 1))
localStorage.setItem("FavNEW", JSON.stringify(users))

//從Favorite刪除
function deleteFromFavorite(id) {
  const userIndex = users.findIndex(user => user.id === id)

  users.splice(userIndex, 1)

  localStorage.setItem('favoriteUsers', JSON.stringify(users))

  location.reload()
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('#deleteFromFavorite')) {
    deleteFromFavorite(Number(event.target.dataset.id))
  }
})

