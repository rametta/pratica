import axios from 'axios'
import { Maybe, get } from 'pratica'

const getUsers = () => axios
  .get('https://jsonplaceholder.typicode.com/users')
  .then(recUsers)
  .catch(errUsers)

const recUsers = res => Maybe(res)
  .chain(get(['data']))
  .map(users => console.log(users) || users)
  .cata({
    Just: users => `<div class="container">
      <div class="columns is-multiline">
        ${users.map(card).join('')}
      </div>
    </div>`,
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Phasellus nec iaculis mauris. <a>@bulmaio</a>.
        <a href="#">#css</a> <a href="#">#responsive</a>
        <br>
        <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
      </div>
    </div>
  </div>
</div>
`

const mount = () => getUsers()
  .then(dom => document.getElementById('app').innerHTML = dom)

mount()


