import { Maybe, get } from 'pratica'

const usersList = users => `
  <div class="container">
    <h1 class="title is-1">Peoples</h1>
    <div class="columns is-multiline">
      ${users.map(card).join('')}
    </div>
  </div>
`

const errUsers = () => `
  <div class="container">
    <article class="message is-danger">
      <div class="message-header">
        <p>Error</p>
      </div>
      <div class="message-body">
        Could not properly fetch data
      </div>
    </article>
  </div>
`

const card = ({ img, name, username }) => `
  <div class="column is-12-mobile is-4-tablet is-3-desktop is-3-fullhd">
    <div class="card">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-48x48">
              <img src="${img.cata({
                Just: img => img,
                Nothing: () => 'https://via.placeholder.com/150/92c952'
              })}" alt="User Avatar">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">${name.cata({
              Just: name => name,
              Nothing: () => 'No name'
            })}</p>
            <p class="subtitle is-6">@${username.cata({
              Just: username => username,
              Nothing: () => 'N/A'
            })}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`

const corruptedUser = { badData: true }

const getUsers = () => fetch('https://reqres.in/api/users?per_page=12')
  .then(res => res.json())
  .then(recUsers)
  .catch(errUsers)

const recUsers = res => Maybe(res)
  .chain(get(['data']))
  .map(users => users.concat(corruptedUser)) // insert bad data on purpose
  .map(users => users.map(userMapper))
  .cata({
    Just: usersList,
    Nothing: errUsers
  })

const userMapper = user => ({
  name: Maybe(user.first_name),
  username: Maybe(user.last_name),
  img: Maybe(user.avatar)
})

const mount = () => getUsers()
  .then(dom => document.getElementById('app').innerHTML = dom)

mount()


