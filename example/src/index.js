import { Maybe, get } from 'pratica'

const getUsers = () => fetch('https://jsonplaceholder.typicode.com/users')
  .then(res => res.json())
  .then(recUsers)
  .catch(errUsers)

const recUsers = res => Maybe(res)
  .map(users => console.log(users) || users)
  .cata({
    Just: users => `
    <div class="container">
      <h1 class="title is-1">Peoples</h1>
      <div class="columns is-multiline">
        ${users.map(card).join('')}
      </div>
    </div>
    `,
    Nothing: () => 'Could not format data'
  })

const errUsers = res => JSON.stringify(res)

const card = user => `
<div class="column is-12-mobile is-4-tablet is-3-desktop is-3-fullhd">
  <div class="card">
    <div class="card-image">
      <figure class="image is-4by3">
        <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">${user.name}</p>
          <p class="subtitle is-6">@${user.username}</p>
        </div>
      </div>

      <div class="content">
        <div>${user.company.catchPhrase}</div>
        <a href="http://${user.website}">${user.website}</a>
        <br>
        <strong>${user.phone}</strong>
      </div>
    </div>
  </div>
</div>
`

const mount = () => getUsers()
  .then(dom => document.getElementById('app').innerHTML = dom)

mount()


