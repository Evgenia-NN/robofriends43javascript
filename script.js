// const users = [
//     {
//         "id": 1,
//         "name": "Leanne Graham",
//         "username": "Bret",
//         "email": "Sincere@april.biz",
//     },
//     {
//         "id": 2,
//         "name": "Ervin Howell",
//         "username": "Antonette",
//         "email": "Shanna@melissa.tv",
//     },
//     {
//         "id": 3,
//         "name": "Clementine Bauch",
//         "username": "Samantha",
//         "email": "Nathan@yesenia.net",
//     },
//     {
//         "id": 4,
//         "name": "Patricia Lebsack",
//         "username": "Karianne",
//         "email": "Julianne.OConner@kory.org",
//     },
//     {
//         "id": 5,
//         "name": "Chelsey Dietrich",
//         "username": "Kamren",
//         "email": "Lucio_Hettinger@annie.ca",
//     },
//     {
//         "id": 6,
//         "name": "Mrs. Dennis Schulist",
//         "username": "Leopoldo_Corkery",
//         "email": "Karley_Dach@jasper.info",
//     },
//     {
//         "id": 7,
//         "name": "Kurtis Weissnat",
//         "username": "Elwyn.Skiles",
//         "email": "Telly.Hoeger@billy.biz",
//     },
//     {
//         "id": 8,
//         "name": "Nicholas Runolfsdottir V",
//         "username": "Maxime_Nienow",
//         "email": "Sherwood@rosamond.me",
//     },
//     {
//         "id": 9,
//         "name": "Glenna Reichert",
//         "username": "Delphine",
//         "email": "Chaim_McDermott@dana.io",
//     },
//     {
//         "id": 10,
//         "name": "Clementina DuBuque",
//         "username": "Moriah.Stanton",
//         "email": "Rey.Padberg@karina.biz",
//     }
// ]


// document.addEventListener("DOMContentLoaded", () => {
//     // render(users)
//     fetch('https://jsonplaceholder.typicode.com/users')
//         .then(response => response.json())
//         .then(data => {
//             users = data
//             return users
//         })
//         .then(render)
//         .catch(error => {
//             console.log(error)
//             alert("Что-то пошло не так")
//         })
// })

let users = []

class Robot {
    constructor({id, name, username, email}) {
        this.id = id
        this.name = name
        this.username = username
        this.email = email
    }

    append(target) {
        if(typeof target === 'string') {
            target = document.querySelector(target)
        }
        target.insertAdjacentHTML('beforeend', 
            `
                <li class="card" data-username="${this.username}">
                    <img class="card__avatar" alt="image-${this.id}" src="https://robohash.org/${this.id}?size=300x300" />
                    <div class="card__description">
                        <h3 class="card__name">${this.name}</h3>
                        <p class="card__email">${this.email}</p>
                    </div> 
                </li>
            `
        )
    }
}

function render(users) {
    const cards = document.querySelector('.cards')
    const form = cards.firstElementChild
    cards.innerHTML = ''
    cards.append(form)

    if (users.length) {
        users.map(user => {
            let robot = new Robot(user)
            robot.append(cards)
            return robot
        })
    }

    // Добавляем обработчики событий mouseenter и mouseleave
    const cardElements = document.querySelectorAll('.card');
    cardElements.forEach(card => {
        const nameElement = card.querySelector('.card__name');
        card.addEventListener('mouseenter', () => {
            if (nameElement) {
                nameElement.textContent = card.dataset.username; // Заменяем имя на никнейм
            }
        });
        card.addEventListener('mouseleave', () => {
            if (nameElement) {
                const originalName = users.find(user => user.username === card.dataset.username)?.name; // Возвращаем имя
                if (originalName) {
                    nameElement.textContent = originalName;
                }
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/users')
        let data = await response.json()
        users = data
        render(users)
    } catch(e) {
        console.log(e)
        alert("Что-то пошло не так...")
    }
})

const search = document.querySelector(".search")
search.oninput = (event) => {
    let value = event.target.value.toLowerCase()
    let filteredRobots = users.filter(user => {
        return (user.name.toLowerCase().includes(value) || 
                user.username.toLowerCase().includes(value) ||
                user.email.toLowerCase().includes(value))
    })
    render(filteredRobots)
}

let form = document.querySelector("form")
form.onsubmit = (event) => {
    event.preventDefault()

    let name = event.target.name.value
    let username = event.target.username.value
    let email = event.target.email.value

    // Проверка на заполненность полей
    let hasError = false;
    if (!name) {
        showError(event.target.name, "Поле 'Имя' не может быть пустым");
        hasError = true;
    } else {
        clearError(event.target.name);
    }

    if (!username) {
        showError(event.target.username, "Поле 'Никнейм' не может быть пустым");
        hasError = true;
    } else {
        clearError(event.target.username);
    }

    if (!email) {
        showError(event.target.email, "Поле 'Email' не может быть пустым");
        hasError = true;
    } else {
        clearError(event.target.email);
    }

    if (hasError) return; // Если есть ошибка, не отправляем форму


    // Если массив users пуст, устанавливаем id = 1, иначе увеличиваем id на 1
    const newId = users.length ? users[users.length - 1].id + 1 : 1;

    users.push({
        id: newId,
        name,
        username,
        email,
    })

    render(users)

    event.target.name.value = ''
    event.target.username.value = ''
    event.target.email.value = ''
}

// Функция для отображения ошибки
function showError(input, message) {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains('error')) {
        error = document.createElement('div');
        error.className = 'error';
        input.parentNode.insertBefore(error, input.nextSibling);
    }
    error.textContent = message;
}

// Функция для очистки ошибки
function clearError(input) {
    let error = input.nextElementSibling;
    if (error && error.classList.contains('error')) {
        error.remove(); // Удаляем элемент с ошибкой
    }
}

